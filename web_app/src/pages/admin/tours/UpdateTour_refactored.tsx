import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getById, update as updateTour, uploadImage } from '../../../api/tour/tour.api'
import { createOneTourDetailAndListPriceAndListItinerary, updateOneTourDetail } from '../../../api/tour/tourdetail.api'
import type { TourResponse } from '../../../types/tour/tour.type'
import type { TourStatus } from '../../../types/enums/TourStatus.enum'
import { TourType } from '../../../types/enums/TourType.enum'
import { TourDetailStatus } from '../../../types/enums/TourDetailStatus.enum'
import { PriceType } from '../../../types/enums/PriceType.enum'
import TourDetailHeader from '../../../compoments/admin/tour/tour-detail/TourDetailHeader'
import TourDetailDepartureCard from '../../../compoments/admin/tour/tour-detail/TourDetailDepartureCard'
import TourDetailPricingCard from '../../../compoments/admin/tour/tour-detail/TourDetailPricingCard'
import TourDetailItineraryCard from '../../../compoments/admin/tour/tour-detail/TourDetailItineraryCard'
import TourDetailActions from '../../../compoments/admin/tour/tour-detail/TourDetailActions'
import TourEditPricingCard from '../../../compoments/admin/tour/tour-detail/TourEditPricingCard'
import TourEditItineraryCard from '../../../compoments/admin/tour/tour-detail/TourEditItineraryCard'
import { createListTourPrice } from '../../../api/tour/tourprice.api'
import { createListTourItinerary } from '../../../api/tour/touritinerary.api'
import TourCreateBasicInfoCard from '../../../compoments/admin/tour/tour-create/TourCreateBasicInfoCard'
import TourCreateMediaCard from '../../../compoments/admin/tour/tour-create/TourCreateMediaCard'
import TourCreateClassificationCard from '../../../compoments/admin/tour/tour-create/TourCreateClassificationCard'
import TourCreatePricingCard from '../../../compoments/admin/tour/tour-create/TourCreatePricingCard'
import TourCreateItineraryCard from '../../../compoments/admin/tour/tour-create/TourCreateItineraryCard'
import TourCreateStepper from '../../../compoments/admin/tour/tour-create/TourCreateStepper'
import type { TourDetailRequest } from '../../../types/tour/tourdetail.type'
import type { TourDetailDraft } from '../../../types/tour/tour-create.type'

const updateSteps = [
  { label: 'Thông tin chung', description: 'Tên tour, mô tả, hình ảnh' },
  { label: 'Lịch khởi hành', description: 'Chọn và chỉnh sửa chi tiết' },
  { label: 'Bảng giá', description: 'Chỉnh sửa giá theo nhóm khách' },
  { label: 'Lịch trình', description: 'Chỉnh sửa kế hoạch theo ngày' },
]

interface UpdateTourFormState {
  title: string
  slug: string
  location: string
  duration: string
  shortDesc: string
  longDesc: string
  imageUrl: string
  gallery: string[]
  tourType: TourType
  status: TourStatus
}

interface UpdateDetailFormState {
  capacity: number
  remainingSeats: number
  startDay: string
  endDay: string
  startLocation: string
  status: string
}

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error !== null) {
    const message = (error as { message?: unknown }).message
    if (typeof message === 'string') return message
  }
  return 'Cập nhật tour thất bại'
}

const createEmptyNewDetailDraft = (startLocation = ''): TourDetailDraft => ({
  startDay: '',
  endDay: '',
  startLocation,
  capacity: '30',
  remainingSeats: '30',
  status: TourDetailStatus.ACTIVE,
  prices: [
    { priceType: PriceType.ADULT, price: '' },
    { priceType: PriceType.CHILD, price: '' },
  ],
  itineraries: [{ dayNumber: '1', title: '', content: '' }],
})

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function UpdateTourPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [currentStep, setCurrentStep] = useState(1)
  const [tour, setTour] = useState<TourResponse | null>(null)
  const [formState, setFormState] = useState<UpdateTourFormState>({
    title: '',
    slug: '',
    location: '',
    duration: '',
    shortDesc: '',
    longDesc: '',
    imageUrl: '',
    gallery: [],
    tourType: TourType.ADVENTURE,
    status: 'DRAFT' as TourStatus,
  })
  const [detailFormState, setDetailFormState] = useState<UpdateDetailFormState>({
    capacity: 30,
    remainingSeats: 30,
    startDay: '',
    endDay: '',
    startLocation: '',
    status: 'ACTIVE',
  })
  const [newDetailDraft, setNewDetailDraft] = useState<TourDetailDraft>(createEmptyNewDetailDraft())
  const [activeDetailIndex, setActiveDetailIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)
  const galleryInputRef = useRef<HTMLInputElement | null>(null)
  const [editingPrices, setEditingPrices] = useState(false)
  const [editingItineraries, setEditingItineraries] = useState(false)
  const [editingDetail, setEditingDetail] = useState(false)
  const [showNewDetailForm, setShowNewDetailForm] = useState(false)

  const activeDetail = tour && tour.tourDetails ? tour.tourDetails[activeDetailIndex] : null
  const hasActiveDetail = activeDetailIndex >= 0 && activeDetail

  const fetchTourDetail = useCallback(async () => {
    if (!id) {
      setError('ID tour không hợp lệ')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const response = await getById(id)

      if (response.code !== 200 || !response.data) {
        throw new Error(response.message || 'Không thể tải thông tin tour')
      }

      const tourData = response.data
      setTour(tourData)
      setFormState({
        title: tourData.title,
        slug: tourData.slug,
        location: tourData.location,
        duration: tourData.duration,
        shortDesc: tourData.shortDesc,
        longDesc: tourData.longDesc,
        imageUrl: tourData.imageUrl,
        gallery: tourData.gallery,
        tourType: tourData.tourType,
        status: tourData.status,
      })
      setNewDetailDraft(createEmptyNewDetailDraft(tourData.location))
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi tải tour'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchTourDetail()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [id, fetchTourDetail])

  useEffect(() => {
    if (!tour || activeDetailIndex < 0 || !tour.tourDetails?.[activeDetailIndex]) return
    const activeDetail = tour.tourDetails[activeDetailIndex]
    const startDayStr = new Date(activeDetail.startDay).toISOString().split('T')[0]
    const endDayStr = new Date(activeDetail.endDay).toISOString().split('T')[0]
    const nextState = {
      capacity: activeDetail.capacity,
      remainingSeats: activeDetail.remainingSeats,
      startDay: startDayStr,
      endDay: endDayStr,
      startLocation: activeDetail.startLocation,
      status: activeDetail.status,
    }

    const t = window.setTimeout(() => {
      setDetailFormState(nextState)
    }, 0)

    return () => window.clearTimeout(t)
  }, [tour, activeDetailIndex])

  const navigateToManager = () => navigate('/admin/tours')

  const handleFooterBack = () => {
    if (currentStep > 1) {
      if (currentStep === 3 || currentStep === 4) {
        setActiveDetailIndex(-1)
      }
      setCurrentStep((current) => Math.max(current - 1, 1))
      return
    }
    navigateToManager()
  }
  

  const handleStepNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2)
      return
    }
    if (currentStep === 2) {
      if (activeDetailIndex < 0) {
        toast.error('Vui lòng chọn lịch khởi hành')
        return
      }
      setCurrentStep(3)
      return
    }
    if (currentStep === 3) {
      setCurrentStep(4)
      return
    }
    if (currentStep === 4) {
      setCurrentStep(1)
      setActiveDetailIndex(-1)
    }
  }

  const handleSelectDetail = (index: number) => {
    setActiveDetailIndex((current) => {
      const nextIndex = current === index ? -1 : index

      if (nextIndex === -1) {
        setEditingDetail(false)
        setEditingPrices(false)
        setEditingItineraries(false)
      } else {
        setEditingDetail(false)
        setEditingPrices(false)
        setEditingItineraries(false)
      }

      return nextIndex
    })
  }

  const updateFormState = (patch: Partial<UpdateTourFormState>) => {
    setFormState((prev) => ({ ...prev, ...patch }))
  }

  const updateDetailFormState = (patch: Partial<UpdateDetailFormState>) => {
    setDetailFormState((prev) => ({ ...prev, ...patch }))
  }

  const updateNewDetailDraft = (patch: Partial<TourDetailDraft>) => {
    setNewDetailDraft((prev) => ({ ...prev, ...patch }))
  }

  const handleGenerateSlug = () => {
    updateFormState({ slug: slugify(formState.title) })
  }

  const handleFormStateChange = (patch: Partial<UpdateTourFormState>) => {
    updateFormState(patch)
  }

  const handleUploadImage = async (file?: File | null) => {
    if (!file) return
    try {
      setUploadingImage(true)
      const uploaded = await uploadImage(file)
      updateFormState({ imageUrl: uploaded.data?.url || '' })
      toast.success('Đã tải ảnh bìa')
      if (coverInputRef.current) {
        coverInputRef.current.value = ''
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    } finally {
      setUploadingImage(false)
    }
  }

  const handleUploadGallery = async (files?: FileList | File[] | null) => {
    const nextFiles = Array.from(files ?? []).filter(Boolean)
    if (nextFiles.length === 0) return

    setUploadingGallery(true)
    try {
      for (const file of nextFiles) {
        const uploaded = await uploadImage(file)
        setFormState((prev) => ({
          ...prev,
          gallery: [...prev.gallery, uploaded.data?.url || ''],
        }))
      }
      toast.success('Đã tải thư viện ảnh')
      if (galleryInputRef.current) {
        galleryInputRef.current.value = ''
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    } finally {
      setUploadingGallery(false)
    }
  }

  const saveTourInfo = async () => {
    if (!id) return

    try {
      setIsSaving(true)
      const response = await updateTour(id, {
        title: formState.title.trim(),
        slug: formState.slug.trim(),
        location: formState.location.trim(),
        duration: formState.duration.trim(),
        shortDesc: formState.shortDesc.trim(),
        longDesc: formState.longDesc.trim(),
        imageUrl: formState.imageUrl.trim(),
        gallery: formState.gallery.map((item) => item.trim()).filter(Boolean),
        tourType: formState.tourType,
        status: formState.status,
      })

      if (response.code !== 200) {
        throw new Error(response.message || 'Cập nhật tour thất bại')
      }

      setTour(response.data || null)
      toast.success('Cập nhật tour thành công')
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  const updateTourDetail = async () => {
    if (!id || !tour || !tour.tourDetails?.[activeDetailIndex]) return

    try {
      setIsSaving(true)
      const detail = tour.tourDetails[activeDetailIndex]

      const response = await updateOneTourDetail(detail.id, {
        capacity: detailFormState.capacity,
        remainingSeats: detailFormState.remainingSeats,
        startDay: new Date(detailFormState.startDay),
        endDay: new Date(detailFormState.endDay),
        startLocation: detailFormState.startLocation,
        status: detailFormState.status as TourDetailStatus,
      })

      if (response.code !== 200) {
        throw new Error(response.message || 'Cập nhật lịch khởi hành thất bại')
      }

      await fetchTourDetail()
      toast.success('Cập nhật lịch khởi hành thành công')
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  const createTourDetail = async () => {
    if (!id || !tour) return

    try {
      setIsSaving(true)
      const payload: TourDetailRequest = {
        capacity: Number(newDetailDraft.capacity) || 30,
        remainingSeats: Number(newDetailDraft.remainingSeats) || 30,
        startDay: new Date(newDetailDraft.startDay),
        endDay: new Date(newDetailDraft.endDay),
        startLocation: newDetailDraft.startLocation.trim() || tour.location,
        status: newDetailDraft.status,
        prices: newDetailDraft.prices.map((item) => ({
          priceType: item.priceType,
          price: Number(item.price) || 0,
        })),
        itineraries: newDetailDraft.itineraries.map((item) => ({
          dayNumber: Number(item.dayNumber) || 1,
          title: item.title.trim(),
          content: item.content.trim(),
        })),
      }
      const response = await createOneTourDetailAndListPriceAndListItinerary(id, payload)

      if (response.code !== 200) {
        throw new Error(response.message || 'Tạo lịch khởi hành thất bại')
      }

      await fetchTourDetail()
      setShowNewDetailForm(false)
      setNewDetailDraft(createEmptyNewDetailDraft(tour.location))
      toast.success('Tạo lịch khởi hành mới thành công')
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 h-12 w-12"></div>
          <p className="text-slate-600">Đang tải thông tin tour...</p>
        </div>
      </div>
    )
  }

  if (error || !tour) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm max-w-md">
          <div className="text-5xl">⚠️</div>
          <p className="text-lg text-slate-700">{error || 'Không tìm thấy tour'}</p>
          <button
            onClick={navigateToManager}
            className="inline-block rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex justify-center pb-24">
      <div className="max-w-6xl w-full px-4 space-y-5 text-left md:px-6">
        <div className="flex items-center justify-between gap-3">
          <TourDetailHeader />
          <span className="text-sm text-slate-500">Chế độ chỉnh sửa</span>
        </div>

        <TourCreateStepper currentStep={currentStep} steps={updateSteps} />

        {/* Step 1: Tour Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <TourCreateBasicInfoCard value={formState} onChange={handleFormStateChange} onGenerateSlug={handleGenerateSlug} />
            <TourCreateMediaCard
              value={{ imageUrl: formState.imageUrl, gallery: formState.gallery }}
              onChange={(patch) => updateFormState(patch)}
              onUploadImage={handleUploadImage}
              onUploadGallery={handleUploadGallery}
              uploadingImage={uploadingImage}
              uploadingGallery={uploadingGallery}
            />
            <TourCreateClassificationCard
              value={{ tourType: formState.tourType, status: formState.status }}
              onChange={(patch) => updateFormState(patch)}
            />
            <div className="flex justify-end">
              <button
                onClick={saveTourInfo}
                disabled={isSaving}
                className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
              >
                {isSaving ? 'Đang lưu...' : 'Lưu thông tin'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Tour Detail Selection & Edit */}
        {currentStep === 2 && tour.tourDetails && tour.tourDetails.length > 0 && (
          <div className="space-y-5">
            <TourDetailDepartureCard
              details={tour.tourDetails}
              activeIndex={activeDetailIndex}
              onSelect={handleSelectDetail}
            />

            {hasActiveDetail && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Lịch Khởi Hành</h2>
                    <p className="text-sm text-slate-500">Chọn lịch khởi hành để xem hoặc chỉnh sửa.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingDetail((current) => !current)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    {editingDetail ? 'Ẩn chỉnh sửa' : 'Chỉnh sửa'}
                  </button>
                </div>

                {editingDetail ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Sức chứa
                        </label>
                        <input
                          type="number"
                          value={detailFormState.capacity}
                          onChange={(e) => updateDetailFormState({ capacity: parseInt(e.target.value) || 0 })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Chỗ còn lại
                        </label>
                        <input
                          type="number"
                          value={detailFormState.remainingSeats}
                          onChange={(e) => updateDetailFormState({ remainingSeats: parseInt(e.target.value) || 0 })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Ngày bắt đầu
                        </label>
                        <input
                          type="date"
                          value={detailFormState.startDay}
                          onChange={(e) => updateDetailFormState({ startDay: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Ngày kết thúc
                        </label>
                        <input
                          type="date"
                          value={detailFormState.endDay}
                          onChange={(e) => updateDetailFormState({ endDay: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Địa điểm khởi hành
                      </label>
                      <input
                        type="text"
                        value={detailFormState.startLocation}
                        onChange={(e) => updateDetailFormState({ startLocation: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        placeholder="Địa điểm khởi hành..."
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Trạng thái
                      </label>
                      <select
                        value={detailFormState.status}
                        onChange={(e) => updateDetailFormState({ status: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="FULL">Đã kín</option>
                        <option value="CANCELLED">Đã hủy</option>
                      </select>
                    </div>

                    <button
                      onClick={updateTourDetail}
                      disabled={isSaving}
                      className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {isSaving ? 'Đang cập nhật...' : 'Cập nhật lịch khởi hành'}
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                    <p className="text-sm text-slate-600">Đang xem lịch khởi hành đã chọn. Bấm "Chỉnh sửa" để mở form cập nhật.</p>
                  </div>
                )}
              </section>
            )}

            <section className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/30 p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Tạo Lịch Khởi Hành Mới</h2>
                  <p className="text-sm text-slate-500">Thêm một đợt khởi hành mới cho tour này.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewDetailForm((current) => !current)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {showNewDetailForm ? 'Ẩn form' : '+ Thêm lịch khởi hành mới'}
                </button>
              </div>

              {showNewDetailForm && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">Thông tin lịch khởi hành mới</h3>
                      <p className="text-sm text-slate-500">Nhập ngày, chỗ ngồi và điểm khởi hành.</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ngày bắt đầu</label>
                        <input
                          type="date"
                          value={newDetailDraft.startDay}
                          onChange={(event) => updateNewDetailDraft({ startDay: event.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ngày kết thúc</label>
                        <input
                          type="date"
                          value={newDetailDraft.endDay}
                          onChange={(event) => updateNewDetailDraft({ endDay: event.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sức chứa</label>
                        <input
                          type="number"
                          min="1"
                          value={newDetailDraft.capacity}
                          onChange={(event) => updateNewDetailDraft({ capacity: event.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Chỗ còn lại</label>
                        <input
                          type="number"
                          min="0"
                          value={newDetailDraft.remainingSeats}
                          onChange={(event) => updateNewDetailDraft({ remainingSeats: event.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Điểm khởi hành</label>
                        <input
                          type="text"
                          value={newDetailDraft.startLocation}
                          onChange={(event) => updateNewDetailDraft({ startLocation: event.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          placeholder="Hà Nội"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái</label>
                        <select
                          value={newDetailDraft.status}
                          onChange={(event) => updateNewDetailDraft({ status: event.target.value as TourDetailStatus })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="ACTIVE">Hoạt động</option>
                          <option value="FULL">Đã kín</option>
                          <option value="CANCELLED">Đã hủy</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <TourCreatePricingCard
                    detail={newDetailDraft}
                    onChange={(prices) => updateNewDetailDraft({ prices })}
                  />
                  <TourCreateItineraryCard
                    detail={newDetailDraft}
                    onChange={(itineraries) => updateNewDetailDraft({ itineraries })}
                  />

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={createTourDetail}
                      disabled={isSaving}
                      className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {isSaving ? 'Đang tạo...' : 'Tạo lịch khởi hành'}
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* Step 3: Pricing */}
        {currentStep === 3 && hasActiveDetail && (
          <div className="space-y-5">
            {!editingPrices && <TourDetailPricingCard detail={activeDetail} />}
            {editingPrices && (
              <TourEditPricingCard
                detail={activeDetail}
                onCancel={() => setEditingPrices(false)}
                onSave={async (prices) => {
                  if (!activeDetail) return
                  try {
                    setIsSaving(true)
                    await createListTourPrice(activeDetail.id, prices)
                    await fetchTourDetail()
                    setEditingPrices(false)
                    toast.success('Cập nhật bảng giá thành công')
                  } catch (err: unknown) {
                    toast.error(getErrorMessage(err))
                  } finally {
                    setIsSaving(false)
                  }
                }}
              />
            )}
            <button
              onClick={() => setEditingPrices(!editingPrices)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {editingPrices ? 'Đóng chỉnh sửa' : 'Chỉnh sửa bảng giá'}
            </button>
          </div>
        )}

        {/* Step 4: Itinerary */}
        {currentStep === 4 && hasActiveDetail && (
          <div className="space-y-5">
            {!editingItineraries && <TourDetailItineraryCard detail={activeDetail} />}
            {editingItineraries && (
              <TourEditItineraryCard
                detail={activeDetail}
                onCancel={() => setEditingItineraries(false)}
                onSave={async (itineraries) => {
                  if (!activeDetail) return
                  try {
                    setIsSaving(true)
                    await createListTourItinerary(activeDetail.id, itineraries)
                    await fetchTourDetail()
                    setEditingItineraries(false)
                    toast.success('Cập nhật lịch trình thành công')
                  } catch (err: unknown) {
                    toast.error(getErrorMessage(err))
                  } finally {
                    setIsSaving(false)
                  }
                }}
              />
            )}
            <button
              onClick={() => setEditingItineraries(!editingItineraries)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {editingItineraries ? 'Đóng chỉnh sửa' : 'Chỉnh sửa lịch trình'}
            </button>
          </div>
        )}

        {/* Navigation moved to sticky footer */}
        <TourDetailActions
          onBack={handleFooterBack}
          onContinue={handleStepNext}
          continueLabel={currentStep === 4 ? 'Hoàn thành' : 'Tiếp tục →'}
          disabled={isSaving}
        />
      </div>
    </div>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getById, update as updateTour, uploadImage } from '../../../api/tour/tour.api'
import { createOneTourDetailAndListPriceAndListItinerary, updateOneTourDetail } from '../../../api/tour/tourdetail.api'
import type { TourResponse } from '../../../types/tour/tour.type'
import type { TourStatus } from '../../../types/enums/TourStatus.enum'
import TourDetailHeader from '../../../compoments/admin/tour/tour-detail/TourDetailHeader'
import TourDetailPricingCard from '../../../compoments/admin/tour/tour-detail/TourDetailPricingCard'
import TourDetailItineraryCard from '../../../compoments/admin/tour/tour-detail/TourDetailItineraryCard'
import TourDetailActions from '../../../compoments/admin/tour/tour-detail/TourDetailActions'
import TourEditPricingCard from '../../../compoments/admin/tour/tour-detail/TourEditPricingCard'
import TourAddPricingCard from '../../../compoments/admin/tour/tour-detail/TourAddPricingCard'
import TourEditItineraryCard from '../../../compoments/admin/tour/tour-detail/TourEditItineraryCard'
import TourAddItineraryCard from '../../../compoments/admin/tour/tour-detail/TourAddItineraryCard'
import { createListTourPrice } from '../../../api/tour/tourprice.api'
import { updateOneTourPrice } from '../../../api/tour/tourprice.api'
import { createListTourItinerary, updateOneTourItinerary } from '../../../api/tour/touritinerary.api'
import TourCreateBasicInfoCard from '../../../compoments/admin/tour/tour-create/TourCreateBasicInfoCard'
import TourCreateMediaCard from '../../../compoments/admin/tour/tour-create/TourCreateMediaCard'
import TourCreateClassificationCard from '../../../compoments/admin/tour/tour-create/TourCreateClassificationCard'
import TourCreateStepper from '../../../compoments/admin/tour/tour-create/TourCreateStepper'
import TourUpdateDepartureSection from '../../../compoments/admin/tour/tour-detail/TourUpdateDepartureSection'
import TourUpdateNewDetailSection from '../../../compoments/admin/tour/tour-detail/TourUpdateNewDetailSection'
import { TourDetailDraftSchema } from '../../../schema/tourCreateSchema'
import { TourUpdateDetailFormSchema, TourUpdateTourInfoSchema } from '../../../schema/tourUpdateSchema'
import { buildCreateDetailPayload, buildTourPayload, buildUpdateDetailPayload, createEmptyNewDetailDraft, slugify, type UpdateDetailFormState, type UpdateTourFormState } from './tourUpdate.helpers'
import type { TourDetailDraft } from '../../../types/tour/tour-create.type'

const updateSteps = [
  { label: 'Thông tin chung', description: 'Tên tour, mô tả, hình ảnh' },
  { label: 'Lịch khởi hành', description: 'Chọn và chỉnh sửa chi tiết' },
  { label: 'Bảng giá', description: 'Chỉnh sửa giá theo nhóm khách' },
  { label: 'Lịch trình', description: 'Chỉnh sửa kế hoạch theo ngày' },
]

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error !== null) {
    const message = (error as { message?: unknown }).message
    if (typeof message === 'string') return message
  }
  return 'Cập nhật tour thất bại'
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
    tourType: 'ADVENTURE' as UpdateTourFormState['tourType'],
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
  const [pricingFormMode, setPricingFormMode] = useState<'edit' | 'add' | null>(null)
  const [itineraryFormMode, setItineraryFormMode] = useState<'edit' | 'add' | null>(null)
  const [editingDetail, setEditingDetail] = useState(false)
  const [showNewDetailForm, setShowNewDetailForm] = useState(false)

  const activeDetail = tour && tour.tourDetails ? tour.tourDetails[activeDetailIndex] : null

  const resetDetailEditors = () => {
    setEditingDetail(false)
    setPricingFormMode(null)
    setItineraryFormMode(null)
  }

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

      resetDetailEditors()

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

    const validation = TourUpdateTourInfoSchema.safeParse(formState)
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || 'Dữ liệu không hợp lệ')
      return
    }

    try {
      setIsSaving(true)
      const response = await updateTour(id, buildTourPayload(validation.data))

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

    const validation = TourUpdateDetailFormSchema.safeParse(detailFormState)
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || 'Dữ liệu không hợp lệ')
      return
    }

    try {
      setIsSaving(true)
      const detail = tour.tourDetails[activeDetailIndex]

      const response = await updateOneTourDetail(detail.id, buildUpdateDetailPayload(validation.data))

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

    const validation = TourDetailDraftSchema.safeParse(newDetailDraft)
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || 'Dữ liệu không hợp lệ')
      return
    }

    try {
      setIsSaving(true)
      const payload = buildCreateDetailPayload(validation.data, tour.location)
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
            <TourUpdateDepartureSection
              details={tour.tourDetails}
              activeIndex={activeDetailIndex}
              editing={editingDetail}
              isSaving={isSaving}
              value={detailFormState}
              onSelect={handleSelectDetail}
              onToggleEditing={() => setEditingDetail((current) => !current)}
              onChange={updateDetailFormState}
              onSave={updateTourDetail}
            />

            <TourUpdateNewDetailSection
              location={tour.location}
              detail={newDetailDraft}
              showForm={showNewDetailForm}
              isSaving={isSaving}
              onToggle={() => setShowNewDetailForm((current) => !current)}
              onChange={updateNewDetailDraft}
              onCreate={createTourDetail}
            />
          </div>
        )}

        {/* Step 3: Pricing */}
        {currentStep === 3 && activeDetail && (
          <div className="space-y-5">
            <TourDetailPricingCard detail={activeDetail} />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setPricingFormMode((current) => (current === 'edit' ? null : 'edit'))}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {pricingFormMode === 'edit' ? 'Ẩn form sửa giá' : 'Chỉnh sửa bảng giá'}
              </button>
              <button
                type="button"
                onClick={() => setPricingFormMode((current) => (current === 'add' ? null : 'add'))}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {pricingFormMode === 'add' ? 'Ẩn form thêm giá' : 'Thêm bảng giá'}
              </button>
            </div>

            {pricingFormMode === 'edit' && (
              <TourEditPricingCard
                key={`${activeDetail.id}-${String(activeDetail.updatedAt)}`}
                detail={activeDetail}
                onUpdate={async (priceId, price) => {
                  if (!activeDetail) return
                  try {
                    setIsSaving(true)
                    await updateOneTourPrice(priceId, price)
                    await fetchTourDetail()
                    setPricingFormMode(null)
                    toast.success('Cập nhật giá thành công')
                  } catch (err: unknown) {
                    toast.error(getErrorMessage(err))
                  } finally {
                    setIsSaving(false)
                  }
                }}
              />
            )}

            {pricingFormMode === 'add' && (
              <TourAddPricingCard
                onCreate={async (prices) => {
                  if (!activeDetail) return
                  try {
                    setIsSaving(true)
                    await createListTourPrice(activeDetail.id, prices)
                    await fetchTourDetail()
                    setPricingFormMode(null)
                    toast.success('Tạo bảng giá thành công')
                  } catch (err: unknown) {
                    toast.error(getErrorMessage(err))
                  } finally {
                    setIsSaving(false)
                  }
                }}
              />
            )}
          </div>
        )}

        {/* Step 4: Itinerary */}
        {currentStep === 4 && activeDetail && (
          <div className="space-y-5">
            <TourDetailItineraryCard detail={activeDetail} />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setItineraryFormMode((current) => (current === 'edit' ? null : 'edit'))}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {itineraryFormMode === 'edit' ? 'Ẩn form sửa lịch trình' : 'Chỉnh sửa lịch trình'}
              </button>
              <button
                type="button"
                onClick={() => setItineraryFormMode((current) => (current === 'add' ? null : 'add'))}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {itineraryFormMode === 'add' ? 'Ẩn form thêm lịch trình' : 'Thêm lịch trình'}
              </button>
            </div>

            {itineraryFormMode === 'edit' && (
              <TourEditItineraryCard
                key={`${activeDetail.id}-${String(activeDetail.updatedAt)}`}
                detail={activeDetail}
                onUpdate={async (itineraryId, itinerary) => {
                  if (!activeDetail) return
                  try {
                    setIsSaving(true)
                    await updateOneTourItinerary(itineraryId, itinerary)
                    await fetchTourDetail()
                    setItineraryFormMode(null)
                    toast.success('Cập nhật lịch trình thành công')
                  } catch (err: unknown) {
                    toast.error(getErrorMessage(err))
                  } finally {
                    setIsSaving(false)
                  }
                }}
              />
            )}

            {itineraryFormMode === 'add' && (
              <TourAddItineraryCard
                onCreate={async (itineraries) => {
                  if (!activeDetail) return
                  try {
                    setIsSaving(true)
                    await createListTourItinerary(activeDetail.id, itineraries)
                    await fetchTourDetail()
                    setItineraryFormMode(null)
                    toast.success('Tạo lịch trình thành công')
                  } catch (err: unknown) {
                    toast.error(getErrorMessage(err))
                  } finally {
                    setIsSaving(false)
                  }
                }}
              />
            )}
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

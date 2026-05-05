import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getById, update as updateTour, uploadImage } from '../../api/tour/tour.api'
import { createOneTourDetailAndListPriceAndListItinerary, updateOneTourDetail } from '../../api/tour/tourdetail.api'
import type { TourResponse } from '../../types/tour/tour.type'
import type { TourDetailResponse, TourDetailRequest, UpdateTourDetailRequest } from '../../types/tour/tourdetail.type'
import TourDetailHeader from '../../compoments/admin/tour-detail/TourDetailHeader'
import TourDetailBasicInfoCard from '../../compoments/admin/tour-detail/TourDetailBasicInfoCard'
import TourDetailMediaCard from '../../compoments/admin/tour-detail/TourDetailMediaCard'
import TourDetailClassificationCard from '../../compoments/admin/tour-detail/TourDetailClassificationCard'
import TourDetailPricingCard from '../../compoments/admin/tour-detail/TourDetailPricingCard'
import TourDetailItineraryCard from '../../compoments/admin/tour-detail/TourDetailItineraryCard'
import TourDetailActions from '../../compoments/admin/tour-detail/TourDetailActions'

interface UpdateTourFormState {
  title: string
  slug: string
  location: string
  duration: string
  shortDesc: string
  longDesc: string
  imageUrl: string
  gallery: string[]
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

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function UpdateTour() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

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
  })
  const [activeDetailIndex, setActiveDetailIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTourDetail()
  }, [id])

  const fetchTourDetail = async () => {
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
      })
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi tải tour'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => navigate(`/admin/tours/${id}`)

  const updateFormState = (patch: Partial<UpdateTourFormState>) => {
    setFormState((prev) => ({ ...prev, ...patch }))
  }

  const handleGenerateSlug = () => {
    updateFormState({ slug: slugify(formState.title) })
  }

  const handleUploadImage = async (file: File) => {
    try {
      setUploadingImage(true)
      const uploaded = await uploadImage(file)
      updateFormState({ imageUrl: uploaded.url })
      toast.success('Đã tải ảnh bìa')
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    } finally {
      setUploadingImage(false)
    }
  }

  const handleUploadGallery = async (files: File[]) => {
    const nextFiles = files.filter(Boolean)
    if (nextFiles.length === 0) return

    setUploadingImage(true)
    try {
      for (const file of nextFiles) {
        const uploaded = await uploadImage(file)
        setFormState((prev) => ({
          ...prev,
          gallery: [...prev.gallery, uploaded.url],
        }))
      }
      toast.success('Đã tải thư viện ảnh')
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    } finally {
      setUploadingImage(false)
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
        tourType: tour!.tourType,
        status: tour!.status,
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

  const addTourDetail = async () => {
    if (!id || !tour) return

    try {
      setIsSaving(true)

      // Minimal default values
      const payload: TourDetailRequest = {
        capacity: 30,
        remainingSeats: 30,
        startDay: new Date(),
        endDay: new Date(),
        startLocation: tour.location,
        status: 'ACTIVE' as any,
        prices: [
          { priceType: 'ADULT', price: 0 },
          { priceType: 'CHILD', price: 0 },
        ],
        itineraries: [
          { dayNumber: 1, title: 'Ngày 1', content: '' },
        ],
      }

      const response = await createOneTourDetailAndListPriceAndListItinerary(id, payload)

      if (response.code !== 200) {
        throw new Error(response.message || 'Tạo lịch khởi hành thất bại')
      }

      // Refresh tour data
      await fetchTourDetail()
      toast.success('Thêm lịch khởi hành thành công')
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  const updateTourDetail = async (detailIndex: number, patch: Partial<UpdateTourDetailRequest>) => {
    if (!id || !tour || !tour.tourDetails?.[detailIndex]) return

    try {
      setIsSaving(true)
      const detail = tour.tourDetails[detailIndex]

      const response = await updateOneTourDetail(detail.id, {
        capacity: patch.capacity ?? detail.capacity,
        remainingSeats: patch.remainingSeats ?? detail.remainingSeats,
        startDay: patch.startDay ?? detail.startDay,
        endDay: patch.endDay ?? detail.endDay,
        startLocation: patch.startLocation ?? detail.startLocation,
        status: patch.status ?? detail.status,
      })

      if (response.code !== 200) {
        throw new Error(response.message || 'Cập nhật lịch khởi hành thất bại')
      }

      // Refresh tour data
      await fetchTourDetail()
      toast.success('Cập nhật lịch khởi hành thành công')
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
            onClick={handleBack}
            className="inline-block rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    )
  }

  const activeDetail = tour.tourDetails?.[activeDetailIndex]

  return (
    <div className="w-full flex justify-center pb-24">
      <div className="max-w-6xl w-full px-4 space-y-5 text-left md:px-6">
        <div className="flex items-center gap-3">
          <TourDetailHeader />
          <span className="text-sm text-slate-500 ml-auto">Chế độ chỉnh sửa</span>
        </div>

        {/* Tour Basic Info - Editable */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">Thông Tin Cơ Bản</h2>
            <p className="text-sm text-slate-500">Chỉnh sửa thông tin tour</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tên tour</label>
              <input
                type="text"
                value={formState.title}
                onChange={(e) => updateFormState({ title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                placeholder="Tên tour..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Slug</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formState.slug}
                    onChange={(e) => updateFormState({ slug: e.target.value })}
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="slug..."
                  />
                  <button
                    type="button"
                    onClick={handleGenerateSlug}
                    className="rounded-lg bg-blue-100 px-3 py-2.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-200"
                  >
                    Tự động
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Địa điểm</label>
                <input
                  type="text"
                  value={formState.location}
                  onChange={(e) => updateFormState({ location: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  placeholder="Địa điểm..."
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Thời lượng</label>
              <input
                type="text"
                value={formState.duration}
                onChange={(e) => updateFormState({ duration: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                placeholder="VD: 3 ngày 2 đêm..."
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mô tả ngắn</label>
              <textarea
                value={formState.shortDesc}
                onChange={(e) => updateFormState({ shortDesc: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                placeholder="Mô tả ngắn tour..."
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mô tả chi tiết</label>
              <textarea
                value={formState.longDesc}
                onChange={(e) => updateFormState({ longDesc: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                placeholder="Mô tả chi tiết tour..."
              />
            </div>

            <button
              onClick={saveTourInfo}
              disabled={isSaving}
              className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {isSaving ? 'Đang lưu...' : 'Lưu thông tin'}
            </button>
          </div>
        </section>

        {/* Media */}
        <TourDetailMediaCard
          tour={tour}
          onUploadImage={(file) => {
            handleUploadImage(file)
          }}
          onUploadGallery={(files) => {
            handleUploadGallery(files)
          }}
          uploadingImage={uploadingImage}
          uploadingGallery={false}
        />

        <TourDetailClassificationCard tour={tour} />

        {/* Tour Details - Manage departures */}
        {tour.tourDetails && tour.tourDetails.length > 0 && (
          <>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Lịch Khởi Hành</h2>
                  <p className="text-sm text-slate-500">Quản lý các đợt khởi hành</p>
                </div>
                <button
                  onClick={addTourDetail}
                  disabled={isSaving}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  + Thêm đợt
                </button>
              </div>

              <div className="space-y-2">
                {tour.tourDetails.map((detail, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveDetailIndex(idx)}
                    className={`w-full text-left rounded-xl border-2 px-4 py-3 transition ${
                      activeDetailIndex === idx
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900">Khởi hành {idx + 1}</p>
                        <p className="text-xs text-slate-600 mt-1">
                          📅 {new Date(detail.startDay).toLocaleDateString('vi-VN')} →{' '}
                          {new Date(detail.endDay).toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-xs text-slate-600">📍 {detail.startLocation}</p>
                      </div>
                      {activeDetailIndex === idx && <span className="ml-2 text-blue-600 text-lg">→</span>}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {activeDetail && (
              <>
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-slate-900">Chỉnh Sửa Lịch Khởi Hành {activeDetailIndex + 1}</h2>
                    <p className="text-sm text-slate-500">Cập nhật thông tin khởi hành</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Ngày khởi hành
                        </label>
                        <input
                          type="date"
                          defaultValue={new Date(activeDetail.startDay).toISOString().split('T')[0]}
                          onChange={(e) => {
                            updateTourDetail(activeDetailIndex, {
                              startDay: new Date(e.target.value),
                            })
                          }}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Ngày kết thúc
                        </label>
                        <input
                          type="date"
                          defaultValue={new Date(activeDetail.endDay).toISOString().split('T')[0]}
                          onChange={(e) => {
                            updateTourDetail(activeDetailIndex, {
                              endDay: new Date(e.target.value),
                            })
                          }}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Sức chứa
                        </label>
                        <input
                          type="number"
                          defaultValue={activeDetail.capacity}
                          onChange={(e) => {
                            updateTourDetail(activeDetailIndex, {
                              capacity: Number(e.target.value),
                            })
                          }}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Chỗ còn lại
                        </label>
                        <input
                          type="number"
                          defaultValue={activeDetail.remainingSeats}
                          onChange={(e) => {
                            updateTourDetail(activeDetailIndex, {
                              remainingSeats: Number(e.target.value),
                            })
                          }}
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
                        defaultValue={activeDetail.startLocation}
                        onChange={(e) => {
                          updateTourDetail(activeDetailIndex, {
                            startLocation: e.target.value,
                          })
                        }}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </section>

                <TourDetailPricingCard detail={activeDetail} />
                <TourDetailItineraryCard detail={activeDetail} />
              </>
            )}
          </>
        )}

        <TourDetailActions onBack={handleBack} />
      </div>
    </div>
  )
}

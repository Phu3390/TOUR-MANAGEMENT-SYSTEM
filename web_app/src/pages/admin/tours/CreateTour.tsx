import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ZodError } from 'zod'
import type { RootState } from '../../../store'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { createTour, uploadTourImage } from '../../../store/tour/slice'
import { PriceType } from '../../../types/enums/PriceType.enum'
import { TourDetailStatus } from '../../../types/enums/TourDetailStatus.enum'
import { TourStatus } from '../../../types/enums/TourStatus.enum'
import { TourType } from '../../../types/enums/TourType.enum'
import type { CreateTourRequest } from '../../../types/tour/tour.type'
import type { TourCreateFormState, TourCreateTourDraft, TourDetailDraft, TourItineraryDraft, TourPriceDraft } from '../../../types/tour/tour-create.type'
import { Step1Schema, Step2Schema, Step3Schema, Step4Schema, TourCreateFormStateSchema } from '../../../schema/tourCreateSchema'
import TourCreateActions from '../../../compoments/admin/tour/tour-create/TourCreateActions'
import TourCreateBasicInfoCard from '../../../compoments/admin/tour/tour-create/TourCreateBasicInfoCard'
import TourCreateClassificationCard from '../../../compoments/admin/tour/tour-create/TourCreateClassificationCard'
import TourCreateDepartureCard from '../../../compoments/admin/tour/tour-create/TourCreateDepartureCard'
import TourCreateHeader from '../../../compoments/admin/tour/tour-create/TourCreateHeader'
import TourCreateItineraryCard from '../../../compoments/admin/tour/tour-create/TourCreateItineraryCard'
import TourCreateMediaCard from '../../../compoments/admin/tour/tour-create/TourCreateMediaCard'
import TourCreatePricingCard from '../../../compoments/admin/tour/tour-create/TourCreatePricingCard'
import TourCreateStepper from '../../../compoments/admin/tour/tour-create/TourCreateStepper'

const DRAFT_KEY = 'tour-create-draft'

const wizardSteps = [
  { label: 'Thông tin chung', description: 'Tên tour, mô tả, hình ảnh' },
  { label: 'Khởi hành', description: 'Ngày đi, sức chứa, điểm đón' },
  { label: 'Bảng giá', description: 'Giá theo nhóm khách' },
  { label: 'Lịch trình', description: 'Kế hoạch theo từng ngày' },
]

function createEmptyPriceDraft(priceType: PriceType): TourPriceDraft {
  return { priceType, price: '' }
}

function createEmptyItineraryDraft(dayNumber = 1): TourItineraryDraft {
  return { dayNumber: String(dayNumber), title: '', content: '' }
}

function createEmptyDetailDraft(index = 1): TourDetailDraft {
  return {
    startDay: '',
    endDay: '',
    startLocation: '',
    capacity: '30',
    remainingSeats: '30',
    status: TourDetailStatus.ACTIVE,
    prices: [createEmptyPriceDraft(PriceType.ADULT), createEmptyPriceDraft(PriceType.CHILD)],
    itineraries: [createEmptyItineraryDraft(index)],
  }
}

function createInitialState(): TourCreateFormState {
  return {
    tour: {
      title: '',
      slug: '',
      location: '',
      duration: '',
      shortDesc: '',
      longDesc: '',
      imageUrl: '',
      gallery: [],
      tourType: TourType.RELAX,
      status: TourStatus.DRAFT,
    },
    tourDetails: [createEmptyDetailDraft(1)],
  }
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

function getErrorMessage(error: unknown) {
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error !== null) {
    const message = (error as { message?: unknown }).message
    if (typeof message === 'string') return message
  }
  return 'Tạo tour thất bại'
}

function toNumber(value: string, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function validateStep(step: number, state: TourCreateFormState): string | null {
  try {
    if (step === 1) {
      Step1Schema.parse(state)
    } else if (step === 2) {
      Step2Schema.parse(state)
    } else if (step === 3) {
      Step3Schema.parse(state)
    } else if (step === 4) {
      Step4Schema.parse(state)
    }
    return null
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const firstError = error.errors[0]
      return firstError?.message || 'Có lỗi xảy ra'
    }
    if (error instanceof Error) {
      return error.message
    }
    return 'Có lỗi xảy ra'
  }
}

function buildPayload(state: TourCreateFormState): CreateTourRequest {
  return {
    tour: {
      title: state.tour.title.trim(),
      slug: state.tour.slug.trim(),
      location: state.tour.location.trim(),
      duration: state.tour.duration.trim(),
      shortDesc: state.tour.shortDesc.trim(),
      longDesc: state.tour.longDesc.trim(),
      imageUrl: state.tour.imageUrl.trim(),
      gallery: state.tour.gallery.map((item) => item.trim()).filter(Boolean),
      rating: 0,
      totalReviews: 0,
      tourType: state.tour.tourType,
      status: state.tour.status,
    },
    tourDetails: state.tourDetails.map((detail) => ({
      capacity: toNumber(detail.capacity, 0),
      remainingSeats: toNumber(detail.remainingSeats, 0),
      startDay: new Date(detail.startDay),
      endDay: new Date(detail.endDay),
      startLocation: detail.startLocation.trim(),
      status: detail.status,
      prices: detail.prices.map((price) => ({
        priceType: price.priceType,
        price: toNumber(price.price, 0),
      })),
      itineraries: detail.itineraries.map((item, index) => ({
        dayNumber: toNumber(item.dayNumber, index + 1),
        title: item.title.trim(),
        content: item.content.trim(),
      })),
    })),
  }
}

function clearDraft() {
  window.localStorage.removeItem(DRAFT_KEY)
}

function loadDraftState(): TourCreateFormState {
  if (typeof window === 'undefined') {
    return createInitialState()
  }

  const raw = window.localStorage.getItem(DRAFT_KEY)
  if (!raw) {
    return createInitialState()
  }

  try {
    const parsed = JSON.parse(raw) as TourCreateFormState
    if (parsed?.tour && Array.isArray(parsed.tourDetails) && parsed.tourDetails.length > 0) {
      return parsed
    }
  } catch {
    clearDraft()
  }

  return createInitialState()
}

export default function CreateTour() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { submitting, uploadingImage } = useAppSelector((state: RootState) => state.tour)

  const [currentStep, setCurrentStep] = useState(1)
  const [activeDetailIndex, setActiveDetailIndex] = useState(0)
  const [formState, setFormState] = useState<TourCreateFormState>(() => loadDraftState())
  const [uploadingGallery, setUploadingGallery] = useState(false)

  useEffect(() => {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(formState))
  }, [formState])

  const updateTour = (patch: Partial<TourCreateTourDraft>) => {
    setFormState((prev) => ({
      ...prev,
      tour: { ...prev.tour, ...patch },
    }))
  }

  const appendGalleryImage = (imageUrl: string) => {
    setFormState((prev) => ({
      ...prev,
      tour: {
        ...prev.tour,
        gallery: [...prev.tour.gallery, imageUrl],
      },
    }))
  }

  const updateDetail = (index: number, patch: Partial<TourDetailDraft>) => {
    setFormState((prev) => ({
      ...prev,
      tourDetails: prev.tourDetails.map((detail, currentIndex) => (currentIndex === index ? { ...detail, ...patch } : detail)),
    }))
  }

  const updatePrices = (prices: TourPriceDraft[]) => {
    updateDetail(activeDetailIndex, { prices })
  }

  const updateItineraries = (itineraries: TourItineraryDraft[]) => {
    updateDetail(activeDetailIndex, { itineraries })
  }

  const addDetail = () => {
    setFormState((prev) => {
      const nextIndex = prev.tourDetails.length
      setActiveDetailIndex(nextIndex)
      return {
        ...prev,
        tourDetails: [...prev.tourDetails, createEmptyDetailDraft(nextIndex + 1)],
      }
    })
  }

  const removeDetail = (index: number) => {
    setFormState((prev) => {
      const nextDetails = prev.tourDetails.filter((_, currentIndex) => currentIndex !== index)
      return {
        ...prev,
        tourDetails: nextDetails.length > 0 ? nextDetails : [createEmptyDetailDraft(1)],
      }
    })

    setActiveDetailIndex((current) => {
      if (current === index) return 0
      if (current > index) return current - 1
      return current
    })
  }

  const saveDraft = () => {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(formState))
    toast.success('Đã lưu nháp tour')
  }

  const submitTour = async () => {
    console.log('Submitting tour with data:', formState)
    try {
      TourCreateFormStateSchema.parse(formState)
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const firstError = error.errors[0]
        toast.error(firstError?.message || 'Dữ liệu không hợp lệ')
      } else if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Dữ liệu không hợp lệ')
      }
      return
    }

    try {
      await dispatch(createTour(buildPayload(formState))).unwrap()
      clearDraft()
      toast.success('Tạo tour thành công')
      navigate('/admin/tours')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleBack = () => {
    if (currentStep === 1) {
      navigate('/admin/tours')
      return
    }
    setCurrentStep((current) => Math.max(current - 1, 1))
  }

  const handleNext = () => {
    console.log('Validation error:',formState.tour.gallery)
    const error = validateStep(currentStep, formState)

    if (error) {
      toast.error(error)
      return
    }

    setCurrentStep((current) => Math.min(current + 1, 4))
  }

  const handleGenerateSlug = () => {
    updateTour({ slug: slugify(formState.tour.title) })
  }

  const handleUploadImage = async (file: File) => {
    try {
      const uploaded = await dispatch(uploadTourImage(file)).unwrap()
      updateTour({ imageUrl: uploaded.url })
      toast.success('Đã tải ảnh bìa')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleUploadGallery = async (files: File[]) => {
    const nextFiles = files.filter(Boolean)
    if (nextFiles.length === 0) return

    setUploadingGallery(true)
    try {
      for (const file of nextFiles) {
        const uploaded = await dispatch(uploadTourImage(file)).unwrap()
        appendGalleryImage(uploaded.url)
      }
      toast.success('Đã tải thư viện ảnh')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setUploadingGallery(false)
    }
  }

  const activeDetail = formState.tourDetails[activeDetailIndex]

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-5xl w-full px-6 space-y-6 text-left">
      <TourCreateHeader />

      <TourCreateStepper currentStep={currentStep} steps={wizardSteps} />

      {currentStep === 1 && (
        <div className="space-y-6">
          <TourCreateBasicInfoCard value={formState.tour} onChange={updateTour} onGenerateSlug={handleGenerateSlug} />
          <TourCreateMediaCard
            value={{ imageUrl: formState.tour.imageUrl, gallery: formState.tour.gallery }}
            onChange={(patch) => updateTour(patch)}
            onUploadImage={handleUploadImage}
            onUploadGallery={handleUploadGallery}
            uploadingImage={uploadingImage}
            uploadingGallery={uploadingGallery}
          />
        </div>
      )}

      <TourCreateClassificationCard value={{ tourType: formState.tour.tourType, status: formState.tour.status }} onChange={updateTour} />

      {currentStep === 2 && (
        <TourCreateDepartureCard
          details={formState.tourDetails}
          activeIndex={activeDetailIndex}
          onSelect={setActiveDetailIndex}
          onAdd={addDetail}
          onRemove={removeDetail}
          onChange={updateDetail}
        />
      )}

      {currentStep === 3 && activeDetail && <TourCreatePricingCard detail={activeDetail} onChange={updatePrices} />}

      {currentStep === 4 && activeDetail && <TourCreateItineraryCard detail={activeDetail} onChange={updateItineraries} />}

      <TourCreateActions
        currentStep={currentStep}
        submitting={submitting}
        onBack={handleBack}
        onCancel={() => navigate('/admin/tours')}
        onSaveDraft={saveDraft}
        onNext={handleNext}
        onSubmit={submitTour}
      />
      </div>
    </div>
  )
}
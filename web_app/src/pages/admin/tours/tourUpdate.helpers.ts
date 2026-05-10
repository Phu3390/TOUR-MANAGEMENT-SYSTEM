import type { TourDetailDraft } from '../../../types/tour/tour-create.type'
import { PriceType } from '../../../types/enums/PriceType.enum'
import { TourDetailStatus } from '../../../types/enums/TourDetailStatus.enum'
import type { TourStatus } from '../../../types/enums/TourStatus.enum'
import { TourType } from '../../../types/enums/TourType.enum'
import type { TourDetailRequest, UpdateTourDetailRequest } from '../../../types/tour/tourdetail.type'
import type { TourRequest } from '../../../types/tour/tour.type'

export interface UpdateTourFormState {
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

export interface UpdateDetailFormState {
  capacity: number
  remainingSeats: number
  startDay: string
  endDay: string
  startLocation: string
  status: string
}

export const createEmptyNewDetailDraft = (startLocation = ''): TourDetailDraft => ({
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

export const slugify = (value: string) => {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export const buildTourPayload = (formState: UpdateTourFormState): TourRequest => {
  return {
    title: formState.title.trim(),
    slug: formState.slug.trim(),
    location: formState.location.trim(),
    duration: formState.duration.trim(),
    shortDesc: formState.shortDesc.trim(),
    longDesc: formState.longDesc.trim(),
    imageUrl: formState.imageUrl.trim(),
    gallery: formState.gallery.map((item) => item.trim()).filter(Boolean),
    rating: 0,
    totalReviews: 0,
    tourType: formState.tourType,
    status: formState.status,
  }
}

export const buildUpdateDetailPayload = (detailFormState: UpdateDetailFormState): UpdateTourDetailRequest => {
  return {
    capacity: detailFormState.capacity,
    remainingSeats: detailFormState.remainingSeats,
    startDay: new Date(detailFormState.startDay),
    endDay: new Date(detailFormState.endDay),
    startLocation: detailFormState.startLocation,
    status: detailFormState.status as TourDetailStatus,
  }
}

export const buildCreateDetailPayload = (draft: TourDetailDraft, fallbackLocation: string): TourDetailRequest => {
  return {
    capacity: Number(draft.capacity) || 30,
    remainingSeats: Number(draft.remainingSeats) || 30,
    startDay: new Date(draft.startDay),
    endDay: new Date(draft.endDay),
    startLocation: draft.startLocation.trim() || fallbackLocation,
    status: draft.status,
    prices: draft.prices.map((item) => ({
      priceType: item.priceType,
      price: Number(item.price) || 0,
    })),
    itineraries: draft.itineraries.map((item) => ({
      dayNumber: Number(item.dayNumber) || 1,
      title: item.title.trim(),
      content: item.content.trim(),
    })),
  }
}

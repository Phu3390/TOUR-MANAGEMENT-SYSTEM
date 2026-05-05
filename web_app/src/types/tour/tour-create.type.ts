import type { PriceType } from '../enums/PriceType.enum'
import type { TourDetailStatus } from '../enums/TourDetailStatus.enum'
import type { TourStatus } from '../enums/TourStatus.enum'
import type { TourType } from '../enums/TourType.enum'

export interface TourCreateTourDraft {
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

export interface TourPriceDraft {
	priceType: PriceType
	price: string
}

export interface TourItineraryDraft {
	dayNumber: string
	title: string
	content: string
}

export interface TourDetailDraft {
	startDay: string
	endDay: string
	startLocation: string
	capacity: string
	remainingSeats: string
	status: TourDetailStatus
	prices: TourPriceDraft[]
	itineraries: TourItineraryDraft[]
}

export interface TourCreateFormState {
	tour: TourCreateTourDraft
	tourDetails: TourDetailDraft[]
}
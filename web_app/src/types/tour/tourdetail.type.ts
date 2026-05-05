import type { ApiResponse } from "../ApiResponse.type";
import type { TourDetailStatus } from "../enums/TourDetailStatus.enum";
import type { TourResponse } from "./tour.type";
import type { TourItineraryRequest, TourItineraryResponse } from "./touritinerary.type";
import type { TourPriceRequest, TourPriceResponse } from "./tourprice.type";

export interface TourDetailRequest {
  capacity: number;
  remainingSeats: number;
  startDay: Date;
  endDay: Date;
  startLocation: string;
  status: TourDetailStatus;
  prices: TourPriceRequest[];
  itineraries: TourItineraryRequest[];
}

export interface UpdateTourDetailRequest {
  capacity: number;
  remainingSeats: number;
  startDay: Date;
  endDay: Date;
  startLocation: string;
  status: TourDetailStatus;
}

export interface TourDetailResponse {
  id: string;
  tour: TourResponse
  capacity: number;
  remainingSeats: number;
  startDay: Date;
  endDay: Date;
  startLocation: string;
  status: TourDetailStatus;
  createdAt:Date;
  updatedAt:Date;
  tourPrices: TourPriceResponse[];
  tourItineraries: TourItineraryResponse[];
}


export type FormTourDetailResponse = ApiResponse<TourDetailResponse>

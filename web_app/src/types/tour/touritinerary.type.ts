import type { ApiResponse } from "../ApiResponse.type";

export interface TourItineraryRequest {
  dayNumber: number;
  title: string;
  content: string;
}

export interface TourItineraryResponse {
  id: string;
  dayNumber: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type FormListTourItineraryResponse = ApiResponse<TourItineraryResponse[]>

export type FormTourItineraryResponse = ApiResponse<TourItineraryResponse>

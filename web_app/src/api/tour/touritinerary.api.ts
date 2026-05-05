import type { FormListTourItineraryResponse, FormTourItineraryResponse, TourItineraryRequest } from "../../types/tour/touritinerary.type"
import api from "../axios"


export async function createListTourItinerary(tourdetail_id: string, payload: TourItineraryRequest[]): Promise<FormListTourItineraryResponse> {
  const res = await api.post(`/tours/touritinerary/${tourdetail_id}`, payload)
  return res.data as FormListTourItineraryResponse
}

export async function updateOneTourItinerar(tourdetail_id: string, payload: TourItineraryRequest): Promise<FormTourItineraryResponse> {
  const res = await api.put(`/tours/touritinerary/${tourdetail_id}`, payload)
  return res.data as FormTourItineraryResponse
}
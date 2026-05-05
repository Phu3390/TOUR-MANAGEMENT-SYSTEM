import type { FormTourDetailResponse, TourDetailRequest, UpdateTourDetailRequest } from "../../types/tour/tourdetail.type"
import api from "../axios"

export async function createOneTourDetailAndListPriceAndListItinerary(tour_id: string, payload: TourDetailRequest): Promise<FormTourDetailResponse> {
  const res = await api.post(`/tours/tourdetail/${tour_id}`, payload)
  return res.data as FormTourDetailResponse
}

export async function updateOneTourDetail(tour_id: string, payload: UpdateTourDetailRequest): Promise<FormTourDetailResponse> {
  const res = await api.put(`/tours/tourdetail/${tour_id}`, payload)
  return res.data as FormTourDetailResponse
}

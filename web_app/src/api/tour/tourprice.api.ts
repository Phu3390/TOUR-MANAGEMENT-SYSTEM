import type { FormListTourPriceResponse, FormTourPriceResponse, TourPriceRequest } from "../../types/tour/tourprice.type"
import api from "../axios"

export async function createListTourPrice(tourdetail_id: string, payload: TourPriceRequest[]): Promise<FormListTourPriceResponse> {
  const res = await api.post(`/tours/tourprice/${tourdetail_id}`, payload)
  return res.data as FormListTourPriceResponse
}

export async function updateOneTourPrice(tourdetail_id: string, payload: TourPriceRequest): Promise<FormTourPriceResponse> {
  const res = await api.put(`/tours/tourprice/${tourdetail_id}`, payload)
  return res.data as FormTourPriceResponse
}
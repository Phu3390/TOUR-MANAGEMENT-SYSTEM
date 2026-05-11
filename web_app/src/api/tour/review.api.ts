import type { DetailReviewResponse, ListDetailReviewResponse, PageReviewResponse, ReviewQueryRequest, ReviewRequest } from "../../types/tour/review.type"
import api from "../axios"

export async function filterReviews(payload: ReviewQueryRequest): Promise<PageReviewResponse> {
  const res = await api.get('/tours/review/filter', { params: payload })
  return res.data as PageReviewResponse
}

export async function getMe(): Promise<ListDetailReviewResponse> {
  const res = await api.get('/tours/review/me')
  return res.data as ListDetailReviewResponse
}

export async function create(tourId: string, payload: ReviewRequest): Promise<DetailReviewResponse> {
  const res = await api.post(`/tours/review/${tourId}`, payload)
  return res.data as DetailReviewResponse
}
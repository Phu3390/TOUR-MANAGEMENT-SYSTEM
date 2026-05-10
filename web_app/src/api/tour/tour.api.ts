import type { TourStatus } from '../../types/enums/TourStatus.enum'
import type { CreateTourRequest, DetailTourResponse, FormUploadImageResponse, PageTourResponse, TourQueryRequest, TourRequest } from '../../types/tour/tour.type'
import api from '../axios'

export async function filterTours(payload: TourQueryRequest): Promise<PageTourResponse> {
  const res = await api.get('/tours/tour/filter', { params: payload })
  return res.data as PageTourResponse
}

export async function createFullTour(payload: CreateTourRequest): Promise<DetailTourResponse> {
  const res = await api.post('/tours/tour', payload)
  return res.data as DetailTourResponse
}

export async function getById(id: string): Promise<DetailTourResponse> {
  const res = await api.get(`/tours/tour/${id}`)
  return res.data as DetailTourResponse
}

export async function update(id: string, payload: TourRequest): Promise<DetailTourResponse> {
  const res = await api.put(`/tours/tour/${id}`, payload)
  return res.data as DetailTourResponse
}

export async function uploadImage(image: File): Promise<FormUploadImageResponse> {
  const formData = new FormData()
  formData.append('file', image)
  const res = await api.post('/tours/filestack/image', formData)
  return res.data as FormUploadImageResponse
}

export async function editStatus(id: string, status: TourStatus): Promise<void> {
  await api.put(`/tours/tour/status/${id}`, JSON.stringify(status), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

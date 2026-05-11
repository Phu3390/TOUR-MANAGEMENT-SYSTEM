import type { BookingDetailResponse, BookingQueryRequest, ListBookingDetailResponse, PageBookingResponse } from '../../types/booking/booking.type'
import type { CreateBookingRequest } from '../../types/booking/create-booking.type'
import api from '../axios'

export async function filterBookings(payload: BookingQueryRequest): Promise<PageBookingResponse> {
  const res = await api.get('/bookings/booking/filter', { params: payload })
  return res.data as PageBookingResponse
}

export async function getById(bookingId: string): Promise<BookingDetailResponse> {
  const res = await api.get(`/bookings/booking/bookingId/${bookingId}`)
  return res.data as BookingDetailResponse
}

export async function getMe(): Promise<ListBookingDetailResponse> {
  const res = await api.get(`/bookings/booking/me`)
  return res.data as ListBookingDetailResponse
}

export async function confirmBooking(booking_id: string): Promise<BookingDetailResponse> {
  const res = await api.post(`/bookings/booking/confirm/${booking_id}`)
  return res.data as BookingDetailResponse
}

export async function cancelBooking(booking_id: string): Promise<BookingDetailResponse> {
  const res = await api.post(`/bookings/booking/cancel/${booking_id}`)
  return res.data as BookingDetailResponse
}

export async function createBooking(payload: CreateBookingRequest): Promise<BookingDetailResponse> {
  const res = await api.post(`/bookings/booking`, payload)
  return res.data as BookingDetailResponse
}

import type { DetailVoucherResponse, PageVoucherResponse, VoucherQueryRequest, VoucherRequest } from '../../types/booking/voucher.type'
import api from '../axios'

export async function filterVouchers(payload: VoucherQueryRequest): Promise<PageVoucherResponse> {
  const res = await api.get('/bookings/voucher/filter', { params: payload })
  return res.data as PageVoucherResponse
}

export async function createVoucher(payload: VoucherRequest): Promise<DetailVoucherResponse> {
  const res = await api.post('/bookings/voucher', payload)
  return res.data as DetailVoucherResponse
}

export async function updateVoucher(id : string, payload: VoucherRequest): Promise<DetailVoucherResponse> {
  const res = await api.put(`/bookings/voucher/${id}`, payload)
  return res.data as DetailVoucherResponse
}

export async function editStatus(id: string, status: string): Promise<DetailVoucherResponse> {
  const res = await api.put(`/bookings/voucher/status/${id}`, status, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
  return res.data as DetailVoucherResponse
}

export async function getVoucherByCode(code: string): Promise<DetailVoucherResponse> {
  const res = await api.get(`/bookings/voucher/${code}`)
  return res.data as DetailVoucherResponse
}

import type { VnPayRequest, VnPayResponse, VnPayReturnResponse } from '../../types/booking/vnpay.type'
import api from '../axios'

type RawVnPayApiResponse = {
  code?: number
  message?: string
  data?: VnPayResponse
  url?: string
}

export async function createPayment(vnpay: VnPayRequest): Promise<VnPayReturnResponse> {
  const res = await api.post('/bookings/vnpay/create', vnpay)
    const resp = res.data as RawVnPayApiResponse

    let body: VnPayResponse | undefined
    let code = 200
    let message = 'OK'

    if (resp && typeof resp === 'object') {
      if (resp.data && typeof resp.data === 'object' && (resp.data.url || resp.data.message)) {
        body = resp.data as VnPayResponse
        code = resp.code ?? 200
        message = resp.message ?? 'OK'
      } else if (resp.url || resp.message) {
        body = resp as VnPayResponse
        code = resp.code ?? 200
        message = resp.message ?? body.message ?? 'OK'
      }
    }

  return {
    code,
    message,
    data: body,
  } as VnPayReturnResponse
}


import type { MomoRequest, MomoReturnResponse, MomoResponse } from "../../types/booking/momo.type"
import api from "../axios"

type RawMomoApiResponse = {
  code?: number
  message?: string
  data?: MomoResponse
  url?: string
}

export async function createMomoPayment(payload: MomoRequest): Promise<MomoReturnResponse> {
  const res = await api.post('/bookings/momo/create', payload)
  const resp = res.data as RawMomoApiResponse

  let body: MomoResponse | undefined
  let code = 200
  let message = 'OK'

  if (resp && typeof resp === 'object') {
    if (resp.data && typeof resp.data === 'object' && (resp.data.url || resp.data.message)) {
      body = resp.data as MomoResponse
      code = resp.code ?? 200
      message = resp.message ?? 'OK'
    } else if (resp.url || resp.message) {
      body = resp as unknown as MomoResponse
      code = resp.code ?? 200
      message = resp.message ?? body.message ?? 'OK'
    }
  }

  return {
    code,
    message,
    data: body,
  } as MomoReturnResponse
}
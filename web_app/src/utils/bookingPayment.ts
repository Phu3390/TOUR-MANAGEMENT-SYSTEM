import { createPayment } from '../api/booking/vnpay.api'
import { createMomoPayment } from '../api/booking/momo.api'
import type { ApiResponse } from '../types/ApiResponse.type'
import type { MomoRequest, MomoReturnResponse } from '../types/booking/momo.type'
import type { BookingResponse } from '../types/booking/booking.type'
import type { PaymentResponse } from '../types/booking/payment.type'
import { PaymentMethod } from '../types/enums/PaymentMethod.enum'
import { PaymentStatus } from '../types/enums/PaymentStatus.enum'
import type { VnPayRequest } from '../types/booking/vnpay.type'

type PaymentLike = PaymentResponse & { paymentId?: string }

export function buildVnPayRequest(paymentId: string, amount: number): VnPayRequest {
  const orderInfo = 'thanhtoanvnpay'

  return {
    paymentId,
    amount,
    orderInfo,
  }
}

export async function createPostBookingPayment(
  booking: BookingResponse,
  method: PaymentMethod,
): Promise<ApiResponse<{ url: string; message: string }> | null> {
  if (method !== PaymentMethod.VNPAY && method !== PaymentMethod.MOMO) {
    return null
  }

  const payment =
    booking.payments?.find((item) => item.method === method && item.status === PaymentStatus.PENDING) ??
    booking.payments?.find((item) => item.method === method)

  // Try to get payment id - some backends might use `id` or `paymentId`
  const paymentRecord = payment as PaymentLike | undefined
  const paymentId = paymentRecord?.id ?? paymentRecord?.paymentId
  if (!paymentId) {
    return null
  }

  if (method === PaymentMethod.VNPAY) {
    const req = buildVnPayRequest(paymentId, booking.totalPrice)
    return createPayment(req)
  }

  // MOMO
  if (method === PaymentMethod.MOMO) {
    const momoReq: MomoRequest = { paymentId, amount: booking.totalPrice }
    return createMomoPayment(momoReq) as Promise<MomoReturnResponse>
  }

  return null
}
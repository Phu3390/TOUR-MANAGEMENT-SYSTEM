export function bookingStatusLabel(status?: string | null) {
  if (!status) return '--'
  switch (status) {
    case 'PENDING':
      return 'Chờ xử lý'
    case 'CONFIRMED':
      return 'Đã xác nhận'
    case 'CANCELLED':
      return 'Đã hủy'
    case 'EXPIRED':
      return 'Hết hạn'
    default:
      return status
  }
}

export function paymentStatusLabel(status?: string | null) {
  if (!status) return '--'
  switch (status) {
    case 'PENDING':
      return 'Chưa thanh toán'
    case 'SUCCESS':
      return 'Thanh toán thành công'
    case 'FAILED':
      return 'Thanh toán thất bại'
    default:
      return status
  }
}

export function paymentMethodLabel(method?: string | null) {
  if (!method) return '--'
  switch (method) {
    case 'VNPAY':
      return 'Ví VNPAY'
    case 'MOMO':
      return 'Ví MOMO'
    case 'CASH':
      return 'Tiền mặt'
    default:
      return method
  }
}

export const bookingStatusOptions = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: bookingStatusLabel('PENDING') },
  { value: 'CONFIRMED', label: bookingStatusLabel('CONFIRMED') },
  { value: 'CANCELLED', label: bookingStatusLabel('CANCELLED') },
  { value: 'EXPIRED', label: bookingStatusLabel('EXPIRED') },
]

export const paymentStatusOptions = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: paymentStatusLabel('PENDING') },
  { value: 'SUCCESS', label: paymentStatusLabel('SUCCESS') },
  { value: 'FAILED', label: paymentStatusLabel('FAILED') },
]

export const paymentMethodOptions = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'VNPAY', label: paymentMethodLabel('VNPAY') },
  { value: 'MOMO', label: paymentMethodLabel('MOMO') },
  { value: 'CASH', label: paymentMethodLabel('CASH') },
]

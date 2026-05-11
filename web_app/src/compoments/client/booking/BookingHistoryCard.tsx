import { Link } from 'react-router-dom'
import type { BookingResponse } from '../../../types/booking/booking.type'
import { BookingStatus } from '../../../types/enums/BookingStatus.enum'
import { PaymentStatus } from '../../../types/enums/PaymentStatus.enum'

type Props = {
  booking: BookingResponse
}

const getStatusBadgeColor = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.CONFIRMED:
      return 'bg-green-100 text-green-800'
    case BookingStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800'
    case BookingStatus.CANCELLED:
      return 'bg-red-100 text-red-800'
    case BookingStatus.EXPIRED:
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-blue-100 text-blue-800'
  }
}

const getPaymentStatusIcon = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.SUCCESS:
      return '✓'
    case PaymentStatus.PENDING:
      return '⏳'
    case PaymentStatus.FAILED:
      return '✗'
    default:
      return '—'
  }
}

const formatVnd = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(value)

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function BookingHistoryCard({ booking }: Props) {
  const totalPeople = booking.items.reduce((sum, item) => sum + item.quantity, 0)
  const lastPayment = booking.payments?.[booking.payments.length - 1]

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        {/* Info Left */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{booking.tourName}</h3>
              <p className="text-sm text-slate-500 mt-1">
                ID: <span className="font-mono text-slate-700">{booking.id.slice(0, 8)}</span>
              </p>
            </div>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeColor(booking.status)}`}>
              {booking.status}
            </span>
          </div>

          {/* Contact Info */}
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
            <div>
              <p className="text-slate-500">Người liên hệ</p>
              <p className="font-medium text-slate-900">{booking.contactFullname}</p>
            </div>
            <div>
              <p className="text-slate-500">Điện thoại</p>
              <p className="font-medium text-slate-900">{booking.contactPhone}</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <div>
              <p className="text-slate-500">Ngày đặt</p>
              <p className="font-medium text-slate-900">{formatDate(booking.createdAt)}</p>
            </div>
            <div>
              <p className="text-slate-500">Số hành khách</p>
              <p className="font-medium text-slate-900">{totalPeople} người</p>
            </div>
            <div>
              <p className="text-slate-500">Thanh toán</p>
              <p className="font-medium text-slate-900">
                {lastPayment ? (
                  <span className="flex items-center gap-1">
                    <span>{getPaymentStatusIcon(lastPayment.status)}</span>
                    {lastPayment.status}
                  </span>
                ) : (
                  '—'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex flex-col items-end gap-3">
          <div className="text-right">
            <p className="text-sm text-slate-500">Tổng tiền</p>
            <p className="text-2xl font-bold text-blue-600">{formatVnd(booking.totalPrice)}</p>
          </div>
          <Link
            to={`/client/bookings/${booking.id}`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Chi tiết
          </Link>
        </div>
      </div>

      {/* Note */}
      {booking.note && (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-500">Ghi chú</p>
          <p className="text-slate-700 text-sm">{booking.note}</p>
        </div>
      )}
    </div>
  )
}

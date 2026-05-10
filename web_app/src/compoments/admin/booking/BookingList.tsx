import type { BookingResponse } from '../../../types/booking/booking.type'
import type { PaymentResponse } from '../../../types/booking/payment.type'
import { bookingStatusLabel, paymentStatusLabel, paymentMethodLabel } from '../../../utils/bookingLabels'


type BookingListProps = {
  bookings: BookingResponse[]
  loading: boolean
  onView?: (id: string) => void
  onConfirm?: (id: string) => Promise<void>
  onCancel?: (id: string) => Promise<void>
}

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

function formatDate(value: Date | string | undefined) {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleString('vi-VN')
}

function getStatusClass(status: string) {
  switch (status) {
    case 'CONFIRMED':
    case 'SUCCESS':
      return 'bg-emerald-50 text-emerald-700'
    case 'PENDING':
      return 'bg-amber-50 text-amber-700'
    case 'CANCELLED':
    case 'FAILED':
      return 'bg-rose-50 text-rose-700'
    case 'EXPIRED':
      return 'bg-slate-100 text-slate-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}


function getLatestPayment(payments: PaymentResponse[] | undefined) {
  if (!payments || payments.length === 0) return null

  return [...payments].sort((a, b) => {
    const left = new Date(b.updatedAt || b.createdAt).getTime()
    const right = new Date(a.updatedAt || a.createdAt).getTime()
    return left - right
  })[0]
}

export default function BookingList({ bookings, loading, onView, onConfirm, onCancel }: BookingListProps) {

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Mã booking</th>
              <th className="px-4 py-3">Thông tin liên hệ</th>
              <th className="px-4 py-3">Tour</th>
              <th className="px-4 py-3">Trạng thái booking</th>
              <th className="px-4 py-3">Trạng thái thanh toán</th>
              <th className="px-4 py-3">Tổng tiền</th>
              <th className="px-4 py-3">Ngày tạo</th>
                  <th className="px-4 py-3">Hết hạn</th>
                  <th className="px-4 py-3">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
                {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                  Đang tải...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                  Không có booking nào
                </td>
              </tr>
            ) : (
              bookings.map((booking) => {
                const latestPayment = getLatestPayment(booking.payments)

                return (
                  <tr key={booking.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-medium text-slate-700">#{booking.id.slice(0, 8)}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{booking.contactFullname}</p>
                      <p className="text-xs text-slate-500">{booking.contactEmail}</p>
                      <p className="text-xs text-slate-500">{booking.contactPhone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-700">{booking.tourName || '--'}</p>
                      <p className="text-xs text-slate-500">Chi tiết tour: {booking.tourDetailId.slice(0, 8)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(booking.status)}`}
                      >
                        {bookingStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1 text-xs">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 font-semibold ${getStatusClass(
                            latestPayment?.status || '',
                          )}`}
                        >
                          {paymentStatusLabel(latestPayment?.status)}
                        </span>
                        <p className="text-slate-500">Phương thức: {paymentMethodLabel(latestPayment?.method)}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {currencyFormatter.format(booking.totalPrice || 0)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(booking.createdAt)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(booking.expiredAt)}</td>
                    <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {onView && (
                            <button
                              type="button"
                              disabled={loading}
                              onClick={() => onView(booking.id)}
                              className="inline-flex items-center rounded border border-blue-600 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                            >
                              Xem
                            </button>
                          )}

                          {booking.status === 'PENDING' && getLatestPayment(booking.payments)?.method === 'CASH' ? (
                            <>
                          <button
                            type="button"
                            disabled={loading}
                            onClick={async () => {
                              try {
                                await (onConfirm ? onConfirm(booking.id) : Promise.resolve())
                              } catch {
                                // handled by parent
                              }
                            }}
                            className="inline-flex items-center rounded bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            Xác nhận
                          </button>

                          <button
                            type="button"
                            disabled={loading}
                            onClick={async () => {
                              try {
                                await (onCancel ? onCancel(booking.id) : Promise.resolve())
                              } catch {
                                // handled by parent
                              }
                            }}
                            className="inline-flex items-center rounded border border-rose-600 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                          >
                            Hủy
                          </button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

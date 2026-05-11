import { Link } from 'react-router-dom'
import type { BookingResponse } from '../../../types/booking/booking.type'
import { bookingStatusLabel, paymentMethodLabel, paymentStatusLabel } from '../../../utils/bookingLabels'
import CreateReviewForm from './CreateReviewForm'

type Props = {
  booking: BookingResponse
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

function statusClass(status?: string) {
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

export default function BookingDetailView({ booking }: Props) {
  const totalPeople = booking.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-100/60 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-emerald-100/50 blur-2xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mã booking</p>
            <p className="mt-1 font-mono text-sm font-semibold text-slate-800 md:text-base">{booking.id}</p>
          </div>

          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusClass(booking.status)}`}>
            {bookingStatusLabel(booking.status)}
          </span>
        </div>

        <div className="relative mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3">
            <p className="text-xs text-blue-700">Tổng tiền</p>
            <p className="mt-1 text-xl font-extrabold text-blue-700">{currencyFormatter.format(booking.totalPrice || 0)}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Số hành khách</p>
            <p className="mt-1 text-lg font-bold text-slate-800">{totalPeople}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Ngày đặt</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{formatDate(booking.createdAt)}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Trạng thái</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{bookingStatusLabel(booking.status)}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="border-b border-slate-100 pb-3 text-lg font-semibold text-slate-900">Thông tin liên hệ</h2>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <p className="rounded-lg bg-slate-50 p-3"><span className="text-slate-500">Họ tên:</span> <span className="ml-1 font-medium text-slate-800">{booking.contactFullname}</span></p>
            <p className="rounded-lg bg-slate-50 p-3"><span className="text-slate-500">Email:</span> <span className="ml-1 font-medium text-slate-800">{booking.contactEmail}</span></p>
            <p className="rounded-lg bg-slate-50 p-3"><span className="text-slate-500">Điện thoại:</span> <span className="ml-1 font-medium text-slate-800">{booking.contactPhone}</span></p>
            <p className="rounded-lg bg-slate-50 p-3"><span className="text-slate-500">Địa chỉ:</span> <span className="ml-1 font-medium text-slate-800">{booking.contactAddress}</span></p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="border-b border-slate-100 pb-3 text-lg font-semibold text-slate-900">Thông tin tour</h2>
          <div className="mt-4 space-y-2 text-sm">
            <p className="rounded-lg bg-slate-50 p-3"><span className="text-slate-500">Tên tour:</span> <span className="ml-1 font-medium text-slate-800">{booking.tourName || '--'}</span></p>
            <p className="rounded-lg bg-slate-50 p-3"><span className="text-slate-500">Mã tour:</span> <span className="ml-1 font-mono text-slate-800">{booking.tourId}</span></p>
          </div>

          <Link
            to={`/client/tours/${booking.tourId}`}
            className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Xem tour
          </Link>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="border-b border-slate-100 pb-3 text-lg font-semibold text-slate-900">Danh sách hành khách theo loại giá</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-100">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3">Loại giá</th>
                <th className="px-4 py-3">Số lượng</th>
                <th className="px-4 py-3">Đơn giá</th>
                <th className="px-4 py-3">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {booking.items?.length ? (
                booking.items.map((item) => {
                  const amount = (item.unitPrice || 0) * (item.quantity || 0)
                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-700">{item.priceType}</td>
                      <td className="px-4 py-3 text-slate-700">{item.quantity}</td>
                      <td className="px-4 py-3 text-slate-700">{currencyFormatter.format(item.unitPrice || 0)}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{currencyFormatter.format(amount)}</td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                    Không có dữ liệu booking item.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="border-b border-slate-100 pb-3 text-lg font-semibold text-slate-900">Thanh toán</h2>
        <div className="mt-4 space-y-3">
          {booking.payments?.length ? (
            booking.payments.map((payment) => (
              <div key={payment.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(payment.status)}`}>
                    {paymentStatusLabel(payment.status)}
                  </span>
                  <span className="text-xs font-medium text-slate-600">{paymentMethodLabel(payment.method)}</span>
                </div>
                <div className="mt-2 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                  <p className="rounded-md bg-white px-3 py-2">Số tiền: {currencyFormatter.format(payment.amount || 0)}</p>
                  <p className="rounded-md bg-white px-3 py-2">Thanh toán lúc: {formatDate(payment.paidAt)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">Chưa có thông tin thanh toán.</p>
          )}
        </div>
      </section>

      {booking.note ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="border-b border-slate-100 pb-3 text-lg font-semibold text-slate-900">Ghi chú</h2>
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{booking.note}</p>
        </section>
      ) : null}

      <CreateReviewForm
        tourId={booking.tourId}
        tourName={booking.tourName || 'Tour'}
      />
    </div>
  )
}

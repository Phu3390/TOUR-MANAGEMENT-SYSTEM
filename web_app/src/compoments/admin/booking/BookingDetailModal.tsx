import { useEffect, useState } from 'react'
import { getById } from '../../../api/booking/booking.api'
import type { BookingResponse } from '../../../types/booking/booking.type'
import { bookingStatusLabel, paymentMethodLabel, paymentStatusLabel } from '../../../utils/bookingLabels'
import { getTourStatusLabel } from '../../../utils/enumTranslation'

type BookingDetailModalProps = {
  open: boolean
  bookingId: string | null
  onClose: () => void
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

function formatShortId(value: string | undefined) {
  if (!value) return '--'
  return value.slice(0, 8)
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  )
}

export default function BookingDetailModal({ open, bookingId, onClose }: BookingDetailModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [booking, setBooking] = useState<BookingResponse | null>(null)

  useEffect(() => {
    if (!open || !bookingId) return

    let alive = true
    setLoading(true)
    setError(null)
    setBooking(null)

    void getById(bookingId)
      .then((response) => {
        if (!alive) return
        if (response.code !== 200 || !response.data) {
          throw new Error(response.message || 'Không thể tải chi tiết booking')
        }
        setBooking(response.data)
      })
      .catch((err: unknown) => {
        if (!alive) return
        const message = err instanceof Error ? err.message : 'Không thể tải chi tiết booking'
        setError(message)
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [open, bookingId])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 p-4" onClick={onClose}>
      <div
        className="mx-auto my-8 w-full max-w-5xl rounded-3xl border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Chi tiết booking</h3>
            <p className="mt-1 text-sm text-slate-500">Xem đầy đủ thông tin booking, thanh toán và voucher liên quan.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-6">
          {loading ? (
            <div className="py-12 text-center text-slate-500">Đang tải chi tiết booking...</div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">{error}</div>
          ) : booking ? (
            <div className="space-y-6">
              <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <InfoRow label="Mã booking" value={formatShortId(booking.id)} />
                <InfoRow label="Trạng thái" value={bookingStatusLabel(booking.status)} />
                <InfoRow label="Tổng tiền" value={currencyFormatter.format(booking.totalPrice || 0)} />
                <InfoRow label="Hết hạn" value={formatDate(booking.expiredAt)} />
              </section>

              <section className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h4 className="text-lg font-semibold text-slate-900">Thông tin liên hệ</h4>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <InfoRow label="Họ và tên" value={booking.contactFullname} />
                    <InfoRow label="Email" value={booking.contactEmail} />
                    <InfoRow label="Số điện thoại" value={booking.contactPhone} />
                    <InfoRow label="Địa chỉ" value={booking.contactAddress} />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <h4 className="text-lg font-semibold text-slate-900">Thông tin tour</h4>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <InfoRow label="Tên tour" value={booking.tourName || '--'} />
                    <InfoRow label="Mã tour" value={formatShortId(booking.tourId)} />
                    <InfoRow label="Mã chi tiết tour" value={formatShortId(booking.tourDetailId)} />
                    <InfoRow label="Ngày tạo" value={formatDate(booking.createdAt)} />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 p-5">
                <h4 className="text-lg font-semibold text-slate-900">Danh sách khách / giá</h4>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Loại giá</th>
                        <th className="px-4 py-3">Số lượng</th>
                        <th className="px-4 py-3">Đơn giá</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {booking.items?.length ? (
                        booking.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 font-semibold text-slate-700">{item.priceType}</td>
                            <td className="px-4 py-3 text-slate-600">{item.quantity}</td>
                            <td className="px-4 py-3 text-slate-600">{currencyFormatter.format(item.unitPrice || 0)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                            Không có item booking
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h4 className="text-lg font-semibold text-slate-900">Thanh toán</h4>
                  <div className="mt-4 space-y-3">
                    {booking.payments?.length ? (
                      booking.payments.map((payment) => (
                        <div key={payment.id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(payment.status)}`}>
                              {paymentStatusLabel(payment.status)}
                            </span>
                            <span className="text-xs text-slate-500">{paymentMethodLabel(payment.method)}</span>
                          </div>
                          <div className="mt-2 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                            <p>Mã giao dịch: {payment.transactionCode || '--'}</p>
                            <p>Nhà cung cấp: {payment.provider || '--'}</p>
                            <p>Số tiền: {currencyFormatter.format(payment.amount || 0)}</p>
                            <p>Thanh toán lúc: {formatDate(payment.paidAt)}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">Chưa có thông tin thanh toán</p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <h4 className="text-lg font-semibold text-slate-900">Voucher áp dụng</h4>
                  <div className="mt-4 space-y-3">
                    {booking.bookingVouchers?.length ? (
                      booking.bookingVouchers.map((bookingVoucher) => (
                        <div key={bookingVoucher.id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                          <p className="font-semibold text-slate-800">{bookingVoucher.voucher?.code || '--'}</p>
                          <p className="text-sm text-slate-600">
                            Giảm: {bookingVoucher.voucher?.discountPercent || 0}% | {currencyFormatter.format(bookingVoucher.voucher?.discountAmount || 0)}
                          </p>
                          <p className="text-xs text-slate-500">Trạng thái: {getTourStatusLabel(bookingVoucher.voucher?.status ?? '--')}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">Không có voucher áp dụng</p>
                    )}
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500">Không có dữ liệu booking.</div>
          )}
        </div>
      </div>
    </div>
  )
}
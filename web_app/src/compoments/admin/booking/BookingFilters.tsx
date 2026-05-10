import type { BookingStatus } from '../../../types/enums/BookingStatus.enum'
import type { PaymentMethod } from '../../../types/enums/PaymentMethod.enum'
import type { PaymentStatus } from '../../../types/enums/PaymentStatus.enum'
import { bookingStatusOptions, paymentStatusOptions, paymentMethodOptions } from '../../../utils/bookingLabels'

export type BookingStatusFilter = 'ALL' | BookingStatus
export type PaymentStatusFilter = 'ALL' | PaymentStatus
export type PaymentMethodFilter = 'ALL' | PaymentMethod

type BookingFiltersProps = {
  keyword: string
  bookingStatus: BookingStatusFilter
  paymentStatus: PaymentStatusFilter
  paymentMethod: PaymentMethodFilter
  minTotalPrice: string
  maxTotalPrice: string
  onKeywordChange: (value: string) => void
  onBookingStatusChange: (value: BookingStatusFilter) => void
  onPaymentStatusChange: (value: PaymentStatusFilter) => void
  onPaymentMethodChange: (value: PaymentMethodFilter) => void
  onMinTotalPriceChange: (value: string) => void
  onMaxTotalPriceChange: (value: string) => void
  onReset: () => void
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

export default function BookingFilters({
  keyword,
  bookingStatus,
  paymentStatus,
  paymentMethod,
  minTotalPrice,
  maxTotalPrice,
  onKeywordChange,
  onBookingStatusChange,
  onPaymentStatusChange,
  onPaymentMethodChange,
  onMinTotalPriceChange,
  onMaxTotalPriceChange,
  onReset,
}: BookingFiltersProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tìm kiếm</label>
          <input
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            type="search"
            placeholder="Nhập tên tour, tên người đặt, email..."
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái booking</label>
          <select
            value={bookingStatus}
            onChange={(event) => onBookingStatusChange(event.target.value as BookingStatusFilter)}
            className={inputClass}
          >
            {bookingStatusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái thanh toán</label>
          <select
            value={paymentStatus}
            onChange={(event) => onPaymentStatusChange(event.target.value as PaymentStatusFilter)}
            className={inputClass}
          >
            {paymentStatusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Phương thức thanh toán</label>
          <select
            value={paymentMethod}
            onChange={(event) => onPaymentMethodChange(event.target.value as PaymentMethodFilter)}
            className={inputClass}
          >
            {paymentMethodOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tổng tiền từ</label>
          <input
            value={minTotalPrice}
            onChange={(event) => onMinTotalPriceChange(event.target.value)}
            type="number"
            min={0}
            placeholder="0"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tổng tiền đến</label>
          <input
            value={maxTotalPrice}
            onChange={(event) => onMaxTotalPriceChange(event.target.value)}
            type="number"
            min={0}
            placeholder="10000000"
            className={inputClass}
          />
        </div>

        {/* removed expiredOnly checkbox as requested */}
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Làm mới bộ lọc
        </button>
      </div>
    </section>
  )
}

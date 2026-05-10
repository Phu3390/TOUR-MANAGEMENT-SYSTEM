export type VoucherStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE' | 'EXPIRED'

type VoucherFiltersProps = {
  keyword: string
  status: VoucherStatusFilter
  minDiscountPercent: string
  maxDiscountPercent: string
  minDiscountAmount: string
  maxDiscountAmount: string
  minQuantity: string
  maxQuantity: string
  onKeywordChange: (value: string) => void
  onStatusChange: (value: VoucherStatusFilter) => void
  onMinDiscountPercentChange: (value: string) => void
  onMaxDiscountPercentChange: (value: string) => void
  onMinDiscountAmountChange: (value: string) => void
  onMaxDiscountAmountChange: (value: string) => void
  onMinQuantityChange: (value: string) => void
  onMaxQuantityChange: (value: string) => void
  onReset: () => void
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

const statusOptions = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Không hoạt động' },
  { value: 'EXPIRED', label: 'Hết hạn' },
]

export default function VoucherFilters({
  keyword,
  status,
  minDiscountPercent,
  maxDiscountPercent,
  minDiscountAmount,
  maxDiscountAmount,
  minQuantity,
  maxQuantity,
  onKeywordChange,
  onStatusChange,
  onMinDiscountPercentChange,
  onMaxDiscountPercentChange,
  onMinDiscountAmountChange,
  onMaxDiscountAmountChange,
  onMinQuantityChange,
  onMaxQuantityChange,
  onReset,
}: VoucherFiltersProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-4">
        {/* First Row */}
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tìm kiếm</label>
            <input
              value={keyword}
              onChange={(event) => onKeywordChange(event.target.value)}
              type="search"
              placeholder="Nhập mã voucher..."
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái</label>
            <select
              value={status}
              onChange={(event) => onStatusChange(event.target.value as VoucherStatusFilter)}
              className={inputClass}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Row - Discount Percent */}
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">% Giảm từ</label>
            <input
              value={minDiscountPercent}
              onChange={(event) => onMinDiscountPercentChange(event.target.value)}
              type="number"
              min={0}
              max={100}
              placeholder="0"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">% Giảm đến</label>
            <input
              value={maxDiscountPercent}
              onChange={(event) => onMaxDiscountPercentChange(event.target.value)}
              type="number"
              min={0}
              max={100}
              placeholder="100"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Giảm giá từ</label>
            <input
              value={minDiscountAmount}
              onChange={(event) => onMinDiscountAmountChange(event.target.value)}
              type="number"
              min={0}
              placeholder="0"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Giảm giá đến</label>
            <input
              value={maxDiscountAmount}
              onChange={(event) => onMaxDiscountAmountChange(event.target.value)}
              type="number"
              min={0}
              placeholder="1000000"
              className={inputClass}
            />
          </div>
        </div>

        {/* Third Row - Quantity */}
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Số lượng từ</label>
            <input
              value={minQuantity}
              onChange={(event) => onMinQuantityChange(event.target.value)}
              type="number"
              min={0}
              placeholder="0"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Số lượng đến</label>
            <input
              value={maxQuantity}
              onChange={(event) => onMaxQuantityChange(event.target.value)}
              type="number"
              min={0}
              placeholder="1000"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
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

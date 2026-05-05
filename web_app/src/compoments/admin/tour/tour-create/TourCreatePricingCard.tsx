import { PriceType } from '../../../../types/enums/PriceType.enum'
import type { TourDetailDraft, TourPriceDraft } from '../../../../types/tour/tour-create.type'

interface TourCreatePricingCardProps {
  detail?: TourDetailDraft
  onChange: (prices: TourPriceDraft[]) => void
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

const priceTypeOptions: Array<{ value: PriceType; label: string }> = [
  { value: PriceType.ADULT, label: 'Người lớn' },
  { value: PriceType.CHILD, label: 'Trẻ em' },
]

export default function TourCreatePricingCard({ detail, onChange }: TourCreatePricingCardProps) {
  if (!detail) return null

  const handleAddRow = () => {
    onChange([...detail.prices, { priceType: PriceType.ADULT, price: '' }])
  }

  const handleUpdateRow = (index: number, patch: Partial<TourPriceDraft>) => {
    onChange(detail.prices.map((row, currentIndex) => (currentIndex === index ? { ...row, ...patch } : row)))
  }

  const handleRemoveRow = (index: number) => {
    onChange(detail.prices.filter((_, currentIndex) => currentIndex !== index))
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Bảng giá &amp; Phụ thu</h2>
        <p className="text-sm text-slate-500">Thiết lập giá theo từng nhóm khách hàng cho đợt khởi hành đang chọn.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="grid grid-cols-12 gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <div className="col-span-4">Loại khách</div>
          <div className="col-span-5">Đơn giá (VND)</div>
          <div className="col-span-3 text-right">Thao tác</div>
        </div>

        <div className="divide-y divide-slate-100 bg-white">
          {detail.prices.map((row, index) => (
            <div key={`${row.priceType}-${index}`} className="grid grid-cols-12 gap-3 px-4 py-3">
              <div className="col-span-4">
                <select
                  value={row.priceType}
                  onChange={(event) => handleUpdateRow(index, { priceType: event.target.value as PriceType })}
                  className={inputClass}
                >
                  {priceTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-5">
                <input
                  value={row.price}
                  onChange={(event) => handleUpdateRow(index, { price: event.target.value })}
                  className={inputClass}
                  inputMode="numeric"
                  placeholder="2500000"
                />
              </div>

              <div className="col-span-3 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleRemoveRow(index)}
                  className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-slate-200 p-3">
          <button
            type="button"
            onClick={handleAddRow}
            className="w-full rounded-xl border border-dashed border-blue-200 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            + Thêm dòng mới
          </button>
        </div>
      </div>
    </section>
  )
}
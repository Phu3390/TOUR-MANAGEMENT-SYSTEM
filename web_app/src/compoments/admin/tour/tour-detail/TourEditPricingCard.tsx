import { useState } from 'react'
import type { TourDetailResponse } from '../../../../types/tour/tourdetail.type'
import type { TourPriceRequest } from '../../../../types/tour/tourprice.type'
import { PriceType } from '../../../../types/enums/PriceType.enum'

type EditableTourPrice = TourPriceRequest & {
  id?: string
}

interface Props {
  detail?: TourDetailResponse
  onUpdate: (priceId: string, price: TourPriceRequest) => Promise<void>
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

export default function TourEditPricingCard({ detail, onUpdate }: Props) {
  const [prices, setPrices] = useState<EditableTourPrice[]>(() => {
    if (!detail) return []
    return (detail.tourPrices || []).map((p) => ({ id: p.id, priceType: p.priceType, price: p.price }))
  })
  const [isSaving, setIsSaving] = useState(false)
  const [savingIndex, setSavingIndex] = useState<number | null>(null)

  if (!detail) return null

  if (!(detail.tourPrices || []).length) {
    return null
  }

  const handleUpdate = (index: number, patch: Partial<EditableTourPrice>) => {
    setPrices(prices.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }

  const handleSaveRow = async (index: number) => {
    const price = prices[index]
    if (!price) return

    setIsSaving(true)
    setSavingIndex(index)
    try {
      if (!price.id) return
      await onUpdate(price.id, { priceType: price.priceType, price: price.price })
    } finally {
      setIsSaving(false)
      setSavingIndex(null)
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Chỉnh sửa Bảng Giá</h2>
          <p className="text-sm text-slate-500">Cập nhật từng loại giá riêng lẻ cho lịch khởi hành này.</p>
        </div>
      </div>

      <div className="space-y-3">
        {prices.map((row, index) => (
          <div key={`${row.priceType}-${index}`} className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {row.priceType === PriceType.ADULT ? 'Người lớn' : 'Trẻ em'}
              </span>
              <button
                type="button"
                onClick={() => handleSaveRow(index)}
                disabled={isSaving && savingIndex === index}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
              >
                {isSaving && savingIndex === index ? 'Đang lưu...' : 'Lưu dòng này'}
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Loại khách</label>
                <select value={row.priceType} onChange={(e) => handleUpdate(index, { priceType: e.target.value as PriceType })} className={inputClass}>
                  <option value={PriceType.ADULT}>Người lớn</option>
                  <option value={PriceType.CHILD}>Trẻ em</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Giá</label>
                <input
                  value={String(row.price)}
                  onChange={(e) => handleUpdate(index, { price: Number(e.target.value) || 0 })}
                  className={inputClass}
                  inputMode="numeric"
                  placeholder="2500000"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

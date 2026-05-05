import { useEffect, useState } from 'react'
import type { TourDetailResponse } from '../../../../types/tour/tourdetail.type'
import type { TourPriceRequest } from '../../../../types/tour/tourprice.type'
import { PriceType } from '../../../../types/enums/PriceType.enum'

interface Props {
  detail?: TourDetailResponse
  onSave: (prices: TourPriceRequest[]) => Promise<void>
  onCancel?: () => void
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

export default function TourEditPricingCard({ detail, onSave, onCancel }: Props) {
  const [prices, setPrices] = useState<TourPriceRequest[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!detail) return
    const initial = (detail.tourPrices || []).map((p) => ({ priceType: p.priceType, price: p.price }))
    setPrices(initial)
  }, [detail])

  if (!detail) return null

  const handleAdd = () => setPrices([...prices, { priceType: PriceType.ADULT, price: 0 }])
  const handleUpdate = (index: number, patch: Partial<TourPriceRequest>) => {
    setPrices(prices.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }
  const handleRemove = (index: number) => setPrices(prices.filter((_, i) => i !== index))

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(prices)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Chỉnh sửa Bảng Giá</h2>
          <p className="text-sm text-slate-500">Cập nhật giá cho lịch khởi hành này.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="rounded-lg border px-3 py-2 text-sm">Hủy</button>
          <button onClick={handleSave} disabled={isSaving} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">
            {isSaving ? 'Đang lưu...' : 'Lưu bảng giá'}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {prices.map((row, index) => (
          <div key={`${row.priceType}-${index}`} className="grid grid-cols-12 gap-3 items-center">
            <div className="col-span-4">
              <select value={row.priceType} onChange={(e) => handleUpdate(index, { priceType: e.target.value as PriceType })} className={inputClass}>
                <option value={PriceType.ADULT}>Người lớn</option>
                <option value={PriceType.CHILD}>Trẻ em</option>
              </select>
            </div>

            <div className="col-span-6">
              <input
                value={String(row.price)}
                onChange={(e) => handleUpdate(index, { price: Number(e.target.value) || 0 })}
                className={inputClass}
                inputMode="numeric"
                placeholder="2500000"
              />
            </div>

            <div className="col-span-2 text-right">
              <button type="button" onClick={() => handleRemove(index)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600">
                Xóa
              </button>
            </div>
          </div>
        ))}

        <div>
          <button type="button" onClick={handleAdd} className="rounded-lg border px-3 py-2 text-sm">
            + Thêm loại giá
          </button>
        </div>
      </div>
    </section>
  )
}

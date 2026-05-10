import { useState } from 'react'
import { PriceType } from '../../../../types/enums/PriceType.enum'
import type { TourPriceRequest } from '../../../../types/tour/tourprice.type'

interface Props {
  onCreate: (prices: TourPriceRequest[]) => Promise<void>
}

type DraftPrice = {
  priceType: PriceType
  price: number
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

const createDefaultRows = (): DraftPrice[] => [
  { priceType: PriceType.ADULT, price: 0 },
  { priceType: PriceType.CHILD, price: 0 },
]

export default function TourAddPricingCard({ onCreate }: Props) {
  const [rows, setRows] = useState<DraftPrice[]>(createDefaultRows)
  const [isSaving, setIsSaving] = useState(false)

  const handleUpdateRow = (index: number, patch: Partial<DraftPrice>) => {
    setRows(rows.map((row, currentIndex) => (currentIndex === index ? { ...row, ...patch } : row)))
  }

  const handleAddRow = () => {
    setRows([...rows, { priceType: PriceType.ADULT, price: 0 }])
  }

  const handleRemoveRow = (index: number) => {
    setRows(rows.filter((_, currentIndex) => currentIndex !== index))
  }

  const handleCreate = async () => {
    setIsSaving(true)
    try {
      await onCreate(rows.map((row) => ({ priceType: row.priceType, price: row.price })))
      setRows(createDefaultRows())
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Thêm Bảng Giá</h2>
          <p className="text-sm text-slate-500">Tạo thêm một danh sách giá mới cho lịch khởi hành này.</p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          disabled={isSaving}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSaving ? 'Đang tạo...' : 'Tạo bảng giá'}
        </button>
      </div>

      <div className="space-y-3">
        {rows.map((row, index) => (
          <div key={`${row.priceType}-${index}`} className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {row.priceType === PriceType.ADULT ? 'Người lớn' : 'Trẻ em'}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveRow(index)}
                className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600"
              >
                Xóa dòng
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Loại khách</label>
                <select value={row.priceType} onChange={(event) => handleUpdateRow(index, { priceType: event.target.value as PriceType })} className={inputClass}>
                  <option value={PriceType.ADULT}>Người lớn</option>
                  <option value={PriceType.CHILD}>Trẻ em</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Giá</label>
                <input
                  value={String(row.price)}
                  onChange={(event) => handleUpdateRow(index, { price: Number(event.target.value) || 0 })}
                  className={inputClass}
                  inputMode="numeric"
                  placeholder="2500000"
                />
              </div>
            </div>
          </div>
        ))}

        <div>
          <button type="button" onClick={handleAddRow} className="rounded-lg border px-3 py-2 text-sm">
            + Thêm loại giá
          </button>
        </div>
      </div>
    </section>
  )
}
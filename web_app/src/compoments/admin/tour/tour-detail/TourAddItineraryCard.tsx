import { useState } from 'react'
import type { TourItineraryRequest } from '../../../../types/tour/touritinerary.type'

interface Props {
  onCreate: (itineraries: TourItineraryRequest[]) => Promise<void>
}

type DraftItinerary = TourItineraryRequest

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

const createDefaultRows = (): DraftItinerary[] => [
  { dayNumber: 1, title: '', content: '' },
  { dayNumber: 2, title: '', content: '' },
]

export default function TourAddItineraryCard({ onCreate }: Props) {
  const [rows, setRows] = useState<DraftItinerary[]>(createDefaultRows)
  const [isSaving, setIsSaving] = useState(false)

  const handleUpdateRow = (index: number, patch: Partial<DraftItinerary>) => {
    setRows(rows.map((row, currentIndex) => (currentIndex === index ? { ...row, ...patch } : row)))
  }

  const handleAddRow = () => {
    setRows([...rows, { dayNumber: rows.length + 1, title: '', content: '' }])
  }

  const handleRemoveRow = (index: number) => {
    setRows(rows.filter((_, currentIndex) => currentIndex !== index))
  }

  const handleCreate = async () => {
    setIsSaving(true)
    try {
      await onCreate(rows)
      setRows(createDefaultRows())
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Thêm Lịch Trình</h2>
          <p className="text-sm text-slate-500">Tạo thêm một danh sách lịch trình mới cho lịch khởi hành này.</p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          disabled={isSaving}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSaving ? 'Đang tạo...' : 'Tạo lịch trình'}
        </button>
      </div>

      <div className="space-y-3">
        {rows.map((row, index) => (
          <div key={`${row.dayNumber}-${index}`} className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Ngày {row.dayNumber}</span>
              <button
                type="button"
                onClick={() => handleRemoveRow(index)}
                className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600"
              >
                Xóa dòng
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ngày</label>
                <input value={String(row.dayNumber)} onChange={(e) => handleUpdateRow(index, { dayNumber: Number(e.target.value) || 1 })} className={inputClass} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tiêu đề</label>
                <input value={row.title} onChange={(e) => handleUpdateRow(index, { title: e.target.value })} className={inputClass} />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Nội dung</label>
                <textarea value={row.content} onChange={(e) => handleUpdateRow(index, { content: e.target.value })} rows={5} className={inputClass} />
              </div>
            </div>
          </div>
        ))}

        <div>
          <button type="button" onClick={handleAddRow} className="rounded-lg border px-3 py-2 text-sm">
            + Thêm ngày
          </button>
        </div>
      </div>
    </section>
  )
}
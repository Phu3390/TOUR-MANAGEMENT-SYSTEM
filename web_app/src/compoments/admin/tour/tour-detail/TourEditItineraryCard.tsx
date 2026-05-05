import { useEffect, useState } from 'react'
import type { TourDetailResponse } from '../../../../types/tour/tourdetail.type'
import type { TourItineraryRequest } from '../../../../types/tour/touritinerary.type'

interface Props {
  detail?: TourDetailResponse
  onSave: (itineraries: TourItineraryRequest[]) => Promise<void>
  onCancel?: () => void
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

export default function TourEditItineraryCard({ detail, onSave, onCancel }: Props) {
  const [itineraries, setItineraries] = useState<TourItineraryRequest[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!detail) return
    const initial = (detail.tourItineraries || []).map((i) => ({ dayNumber: i.dayNumber, title: i.title, content: i.content }))
    setItineraries(initial)
  }, [detail])

  if (!detail) return null

  const handleAdd = () => setItineraries([...itineraries, { dayNumber: itineraries.length + 1, title: '', content: '' }])
  const handleUpdate = (index: number, patch: Partial<TourItineraryRequest>) => {
    setItineraries(itineraries.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }
  const handleRemove = (index: number) => setItineraries(itineraries.filter((_, i) => i !== index))

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(itineraries)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Chỉnh sửa Lịch Trình</h2>
          <p className="text-sm text-slate-500">Cập nhật lịch trình theo ngày cho lịch khởi hành này.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="rounded-lg border px-3 py-2 text-sm">Hủy</button>
          <button onClick={handleSave} disabled={isSaving} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">
            {isSaving ? 'Đang lưu...' : 'Lưu lịch trình'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {itineraries.map((row, index) => (
          <div key={`${row.dayNumber}-${index}`} className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Ngày {row.dayNumber}</span>
              <button type="button" onClick={() => handleRemove(index)} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600">
                Xóa
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ngày</label>
                <input value={String(row.dayNumber)} onChange={(e) => handleUpdate(index, { dayNumber: Number(e.target.value) || 1 })} className={inputClass} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tiêu đề</label>
                <input value={row.title} onChange={(e) => handleUpdate(index, { title: e.target.value })} className={inputClass} />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Nội dung</label>
                <textarea value={row.content} onChange={(e) => handleUpdate(index, { content: e.target.value })} rows={5} className={inputClass} />
              </div>
            </div>
          </div>
        ))}

        <div>
          <button type="button" onClick={handleAdd} className="rounded-lg border px-3 py-2 text-sm">+ Thêm ngày</button>
        </div>
      </div>
    </section>
  )
}

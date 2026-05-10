import { useState } from 'react'
import type { TourDetailResponse } from '../../../../types/tour/tourdetail.type'
import type { TourItineraryRequest } from '../../../../types/tour/touritinerary.type'

interface Props {
  detail?: TourDetailResponse
  onUpdate: (itineraryId: string, itinerary: TourItineraryRequest) => Promise<void>
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

type EditableItinerary = TourItineraryRequest & {
  id: string
}

export default function TourEditItineraryCard({ detail, onUpdate }: Props) {
  const [itineraries, setItineraries] = useState<EditableItinerary[]>(() => {
    if (!detail) return []
    return (detail.tourItineraries || []).map((i) => ({ id: i.id, dayNumber: i.dayNumber, title: i.title, content: i.content }))
  })
  const [isSaving, setIsSaving] = useState(false)
  const [savingIndex, setSavingIndex] = useState<number | null>(null)

  if (!detail) return null

  if (!(detail.tourItineraries || []).length) {
    return null
  }

  const handleUpdate = (index: number, patch: Partial<EditableItinerary>) => {
    setItineraries(itineraries.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }

  const handleSaveRow = async (index: number) => {
    const itinerary = itineraries[index]
    if (!itinerary) return

    setIsSaving(true)
    setSavingIndex(index)
    try {
      await onUpdate(itinerary.id, {
        dayNumber: itinerary.dayNumber,
        title: itinerary.title,
        content: itinerary.content,
      })
    } finally {
      setIsSaving(false)
      setSavingIndex(null)
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Chỉnh sửa Lịch Trình</h2>
          <p className="text-sm text-slate-500">Cập nhật từng ngày lịch trình cho lịch khởi hành này.</p>
        </div>
      </div>

      <div className="space-y-4">
        {itineraries.map((row, index) => (
          <div key={`${row.dayNumber}-${index}`} className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Ngày {row.dayNumber}</span>
              <button
                type="button"
                onClick={() => handleSaveRow(index)}
                disabled={isSaving && savingIndex === index}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
              >
                {isSaving && savingIndex === index ? 'Đang lưu...' : 'Lưu ngày này'}
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
      </div>
    </section>
  )
}

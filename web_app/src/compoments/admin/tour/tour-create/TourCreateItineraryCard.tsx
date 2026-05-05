import type { TourDetailDraft, TourItineraryDraft } from '../../../../types/tour/tour-create.type'

interface TourCreateItineraryCardProps {
  detail?: TourDetailDraft
  onChange: (itineraries: TourItineraryDraft[]) => void
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

export default function TourCreateItineraryCard({ detail, onChange }: TourCreateItineraryCardProps) {
  if (!detail) return null

  const handleAddRow = () => {
    const nextDay = detail.itineraries.length + 1
    onChange([...detail.itineraries, { dayNumber: String(nextDay), title: '', content: '' }])
  }

  const handleUpdateRow = (index: number, patch: Partial<TourItineraryDraft>) => {
    onChange(detail.itineraries.map((row, currentIndex) => (currentIndex === index ? { ...row, ...patch } : row)))
  }

  const handleRemoveRow = (index: number) => {
    onChange(detail.itineraries.filter((_, currentIndex) => currentIndex !== index))
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Chi tiết lịch trình</h2>
        <p className="text-sm text-slate-500">Thêm mô tả theo từng ngày cho đợt khởi hành đang chọn.</p>
      </div>

      <div className="space-y-4">
        {detail.itineraries.map((row, index) => (
          <div key={`${row.dayNumber}-${index}`} className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Ngày {row.dayNumber || index + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveRow(index)}
                className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                Xóa
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ngày</label>
                <input
                  value={row.dayNumber}
                  onChange={(event) => handleUpdateRow(index, { dayNumber: event.target.value })}
                  className={inputClass}
                  placeholder="1"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tiêu đề</label>
                <input
                  value={row.title}
                  onChange={(event) => handleUpdateRow(index, { title: event.target.value })}
                  className={inputClass}
                  placeholder="Đón khách tại sân bay"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Nội dung</label>
                <textarea
                  value={row.content}
                  onChange={(event) => handleUpdateRow(index, { content: event.target.value })}
                  rows={5}
                  className={inputClass}
                  placeholder="Mô tả chi tiết các hoạt động trong ngày..."
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddRow}
          className="w-full rounded-2xl border border-dashed border-blue-200 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          + Thêm ngày mới
        </button>
      </div>
    </section>
  )
}
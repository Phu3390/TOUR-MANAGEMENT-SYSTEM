import { TourDetailStatus } from '../../../../types/enums/TourDetailStatus.enum'
import type { TourDetailDraft } from '../../../../types/tour/tour-create.type'

interface TourCreateDepartureCardProps {
  details: TourDetailDraft[]
  activeIndex: number
  onSelect: (index: number) => void
  onAdd: () => void
  onRemove: (index: number) => void
  onChange: (index: number, patch: Partial<TourDetailDraft>) => void
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

const statusOptions = [
  { value: TourDetailStatus.ACTIVE, label: 'Mở bán' },
  { value: TourDetailStatus.FULL, label: 'Đầy chỗ' },
  { value: TourDetailStatus.CANCELLED, label: 'Hủy' },
]

export default function TourCreateDepartureCard({ details, activeIndex, onSelect, onAdd, onRemove, onChange }: TourCreateDepartureCardProps) {
  const activeDetail = details[activeIndex]

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Thiết lập lịch khởi hành</h2>
        <p className="text-sm text-slate-500">Thêm một hoặc nhiều đợt khởi hành cho tour này.</p>
      </div>

      <div className="space-y-4">
        {details.map((detail, index) => {
          const isActive = index === activeIndex

          return (
            <div key={index} className={`rounded-2xl border ${isActive ? 'border-blue-200 bg-blue-50/40' : 'border-slate-200 bg-slate-50/50'}`}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">Đợt khởi hành {index + 1}</p>
                  <p className="text-xs text-slate-500">
                    {detail.startDay && detail.endDay ? `${detail.startDay} - ${detail.endDay}` : 'Chưa có ngày khởi hành'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {details.length > 1 && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        onRemove(index)
                      }}
                      className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      Xóa
                    </button>
                  )}
                  <span className={`text-sm font-semibold ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>{isActive ? 'Đang sửa' : 'Xem'}</span>
                </div>
              </button>
            </div>
          )
        })}

        <button
          type="button"
          onClick={onAdd}
          className="w-full rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 px-4 py-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          + Thêm lịch khởi hành khác
        </button>

        {activeDetail && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Đợt khởi hành {activeIndex + 1}</h3>
                <p className="text-sm text-slate-500">Nhập ngày đi, ngày về, số chỗ và điểm khởi hành.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ngày khởi hành</label>
                <input
                  type="date"
                  value={activeDetail.startDay}
                  onChange={(event) => onChange(activeIndex, { startDay: event.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ngày kết thúc</label>
                <input
                  type="date"
                  value={activeDetail.endDay}
                  onChange={(event) => onChange(activeIndex, { endDay: event.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sức chứa</label>
                <input
                  type="number"
                  min="1"
                  value={activeDetail.capacity}
                  onChange={(event) => onChange(activeIndex, { capacity: event.target.value })}
                  className={inputClass}
                  placeholder="30"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Chỗ còn trống</label>
                <input
                  type="number"
                  min="0"
                  value={activeDetail.remainingSeats}
                  onChange={(event) => onChange(activeIndex, { remainingSeats: event.target.value })}
                  className={inputClass}
                  placeholder="30"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Điểm khởi hành</label>
                <input
                  value={activeDetail.startLocation}
                  onChange={(event) => onChange(activeIndex, { startLocation: event.target.value })}
                  className={inputClass}
                  placeholder="Hà Nội (Sân bay Nội Bài)"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái chi tiết</label>
                <select
                  value={activeDetail.status}
                  onChange={(event) => onChange(activeIndex, { status: event.target.value as TourDetailStatus })}
                  className={inputClass}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
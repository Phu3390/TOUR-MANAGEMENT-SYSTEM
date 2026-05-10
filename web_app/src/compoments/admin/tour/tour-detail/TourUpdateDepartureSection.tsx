import type { TourResponse } from '../../../../types/tour/tour.type'
import { TourDetailStatus } from '../../../../types/enums/TourDetailStatus.enum'
import TourDetailDepartureCard from './TourDetailDepartureCard'
import type { UpdateDetailFormState } from '../../../../pages/admin/tours/tourUpdate.helpers'

interface Props {
  details: TourResponse['tourDetails']
  activeIndex: number
  editing: boolean
  isSaving: boolean
  value: UpdateDetailFormState
  onSelect: (index: number) => void
  onToggleEditing: () => void
  onChange: (patch: Partial<UpdateDetailFormState>) => void
  onSave: () => Promise<void>
}

export default function TourUpdateDepartureSection({
  details,
  activeIndex,
  editing,
  isSaving,
  value,
  onSelect,
  onToggleEditing,
  onChange,
  onSave,
}: Props) {
  if (!details || details.length === 0) {
    return null
  }

  return (
    <>
      <TourDetailDepartureCard details={details} activeIndex={activeIndex} onSelect={onSelect} />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Lịch Khởi Hành</h2>
            <p className="text-sm text-slate-500">Chọn lịch khởi hành để xem hoặc chỉnh sửa.</p>
          </div>
          <button
            type="button"
            onClick={onToggleEditing}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {editing ? 'Ẩn chỉnh sửa' : 'Chỉnh sửa'}
          </button>
        </div>

        {editing ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sức chứa</label>
                <input
                  type="number"
                  value={value.capacity}
                  onChange={(event) => onChange({ capacity: Number(event.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  min="1"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Chỗ còn lại</label>
                <input
                  type="number"
                  value={value.remainingSeats}
                  onChange={(event) => onChange({ remainingSeats: Number(event.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  min="0"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ngày bắt đầu</label>
                <input
                  type="date"
                  value={value.startDay}
                  onChange={(event) => onChange({ startDay: event.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ngày kết thúc</label>
                <input
                  type="date"
                  value={value.endDay}
                  onChange={(event) => onChange({ endDay: event.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Địa điểm khởi hành</label>
              <input
                type="text"
                value={value.startLocation}
                onChange={(event) => onChange({ startLocation: event.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                placeholder="Địa điểm khởi hành..."
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái</label>
              <select
                value={value.status}
                onChange={(event) => onChange({ status: event.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value={TourDetailStatus.ACTIVE}>Hoạt động</option>
                <option value={TourDetailStatus.FULL}>Đã kín</option>
                <option value={TourDetailStatus.CANCELLED}>Đã hủy</option>
              </select>
            </div>

            <button
              onClick={onSave}
              disabled={isSaving}
              className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {isSaving ? 'Đang cập nhật...' : 'Cập nhật lịch khởi hành'}
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="text-sm text-slate-600">Đang xem lịch khởi hành đã chọn. Bấm "Chỉnh sửa" để mở form cập nhật.</p>
          </div>
        )}
      </section>
    </>
  )
}

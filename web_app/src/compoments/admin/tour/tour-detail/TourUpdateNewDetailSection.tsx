import type { TourDetailDraft } from '../../../../types/tour/tour-create.type'
import TourCreatePricingCard from '../tour-create/TourCreatePricingCard'
import TourCreateItineraryCard from '../tour-create/TourCreateItineraryCard'

interface Props {
  location: string
  detail: TourDetailDraft
  showForm: boolean
  isSaving: boolean
  onToggle: () => void
  onChange: (patch: Partial<TourDetailDraft>) => void
  onCreate: () => Promise<void>
}

export default function TourUpdateNewDetailSection({
  location,
  detail,
  showForm,
  isSaving,
  onToggle,
  onChange,
  onCreate,
}: Props) {
  return (
    <section className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/30 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Tạo Lịch Khởi Hành Mới</h2>
          <p className="text-sm text-slate-500">Thêm một đợt khởi hành mới cho tour này.</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {showForm ? 'Ẩn form' : '+ Thêm lịch khởi hành mới'}
        </button>
      </div>

      {showForm && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Thông tin lịch khởi hành mới</h3>
              <p className="text-sm text-slate-500">Nhập ngày, chỗ ngồi và điểm khởi hành.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ngày bắt đầu</label>
                <input
                  type="date"
                  value={detail.startDay}
                  onChange={(event) => onChange({ startDay: event.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ngày kết thúc</label>
                <input
                  type="date"
                  value={detail.endDay}
                  onChange={(event) => onChange({ endDay: event.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sức chứa</label>
                <input
                  type="number"
                  min="1"
                  value={detail.capacity}
                  onChange={(event) => onChange({ capacity: event.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Chỗ còn lại</label>
                <input
                  type="number"
                  min="0"
                  value={detail.remainingSeats}
                  onChange={(event) => onChange({ remainingSeats: event.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Điểm khởi hành</label>
                <input
                  type="text"
                  value={detail.startLocation}
                  onChange={(event) => onChange({ startLocation: event.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  placeholder={location}
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái</label>
                <select
                  value={detail.status}
                  onChange={(event) => onChange({ status: event.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="FULL">Đã kín</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>
            </div>
          </div>

          <TourCreatePricingCard detail={detail} onChange={(prices) => onChange({ prices })} />
          <TourCreateItineraryCard detail={detail} onChange={(itineraries) => onChange({ itineraries })} />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCreate}
              disabled={isSaving}
              className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {isSaving ? 'Đang tạo...' : 'Tạo lịch khởi hành'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

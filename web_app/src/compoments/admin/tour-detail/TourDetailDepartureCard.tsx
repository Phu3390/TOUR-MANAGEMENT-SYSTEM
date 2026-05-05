import type { TourDetailResponse } from '../../../types/tour/tourdetail.type'
import { getTourDetailStatusColor, getTourDetailStatusLabel } from '../../../utils/enumTranslation'

interface TourDetailDepartureCardProps {
  details: TourDetailResponse[]
  activeIndex: number
  onSelect: (index: number) => void
}

const formatDate = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export default function TourDetailDepartureCard({
  details,
  activeIndex,
  onSelect,
}: TourDetailDepartureCardProps) {
  if (!details || details.length === 0) {
    return null
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Lịch Khởi Hành</h2>
        <p className="text-sm text-slate-500">Chọn lịch khởi hành để xem chi tiết giá và lịch trình</p>
      </div>

      <div className="space-y-2">
        {details.map((detail, idx) => {
          const statusBadge = getTourDetailStatusColor(detail.status)

          return (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              className={`w-full text-left rounded-xl border-2 px-4 py-3 transition ${
                activeIndex === idx
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-semibold text-slate-900">Khởi hành {idx + 1}</p>
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        detail.status === 'ACTIVE'
                          ? 'bg-emerald-600'
                          : detail.status === 'FULL'
                          ? 'bg-orange-600'
                          : 'bg-rose-600'
                      }`} />
                      {getTourDetailStatusLabel(detail.status)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-1">📅 {formatDate(detail.startDay)} → {formatDate(detail.endDay)}</p>
                  <p className="text-xs text-slate-600">📍 {detail.startLocation} • 👥 {detail.remainingSeats}/{detail.capacity}</p>
                </div>
                {activeIndex === idx && <span className="ml-2 text-blue-600 text-lg">→</span>}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

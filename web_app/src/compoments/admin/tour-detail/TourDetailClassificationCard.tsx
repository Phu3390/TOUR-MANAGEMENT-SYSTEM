import type { TourResponse } from '../../../types/tour/tour.type'
import {
  getTourStatusColor,
  getTourStatusLabel,
  getTourTypeColor,
  getTourTypeLabel,
} from '../../../utils/enumTranslation'

interface TourDetailClassificationCardProps {
  tour: TourResponse
}

export default function TourDetailClassificationCard({ tour }: TourDetailClassificationCardProps) {
  const statusBadge = getTourStatusColor(tour.status)
  const tourTypeBadge = getTourTypeColor(tour.tourType)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Phân Loại</h2>
        <p className="text-sm text-slate-500">Loại tour và trạng thái</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Loại tour</label>
          <p className={`rounded-lg border border-slate-200 ${tourTypeBadge.bg} px-3 py-2.5 text-sm font-medium ${tourTypeBadge.text}`}>
            {getTourTypeLabel(tour.tourType)}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái</label>
          <div className={`rounded-lg border border-slate-200 ${statusBadge.bg} px-3 py-2.5 text-sm font-medium ${statusBadge.text}`}>
            {getTourStatusLabel(tour.status)}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Đánh giá</label>
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
            ⭐ {tour.rating?.toFixed(1) || '0'}/5 ({tour.totalReviews || 0} đánh giá)
          </p>
        </div>
      </div>
    </section>
  )
}

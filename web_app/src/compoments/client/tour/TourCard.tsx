import { Link } from 'react-router-dom'
import type { TourResponse } from '../../../types/tour/tour.type'

type Props = {
  tour: TourResponse
}

export default function TourCard({ tour }: Props) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-hidden rounded-t-lg">
        <img src={tour.imageUrl} alt={tour.title} className="h-44 w-full object-cover" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="min-h-14 text-lg font-semibold text-slate-900 line-clamp-2">{tour.title}</h3>
        <p className="mt-1 min-h-5 text-sm text-slate-500 line-clamp-1">{tour.location} • {tour.duration}</p>

        <p className="mt-3 text-sm text-slate-700 line-clamp-3">{tour.shortDesc}</p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="text-sm text-slate-600">⭐ {tour.rating?.toFixed(1) || '—'} ({tour.totalReviews || 0})</div>
          <Link to={`/client/tours/${tour.id}`} className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700">
            Xem thêm
          </Link>
        </div>
      </div>
    </article>
  )
}

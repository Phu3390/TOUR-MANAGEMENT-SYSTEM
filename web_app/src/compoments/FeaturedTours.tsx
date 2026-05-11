import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as tourApi from '../api/tour/tour.api'
import type { TourResponse } from '../types/tour/tour.type'

export default function FeaturedTours() {
  const [tours, setTours] = useState<TourResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        setLoading(true)
        const res = await tourApi.filterTours({
          minRating: 4.0,
          pageNumber: 0,
          size: 6,
          sortBy: 'rating',
          sortDir: 'desc',
        })
        if (res.code === 200 && res.data?.content) {
          setTours(res.data.content)
        }
      } catch (error) {
        console.error('Failed to fetch featured tours:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedTours()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-80 animate-pulse rounded-lg bg-slate-200" />
        ))}
      </div>
    )
  }

  if (tours.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 py-12 text-center">
        <p className="text-slate-600">Chưa có tour nổi bật</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tours.map((tour) => (
        <Link
          key={tour.id}
          to={`/client/tours/${tour.id}`}
          className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
        >
          {/* Image */}
          <div className="relative h-48 overflow-hidden bg-slate-200">
            <img
              src={tour.imageUrl}
              alt={tour.title}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Location */}
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">{tour.location}</p>

            {/* Title */}
            <h3 className="mt-2 line-clamp-2 text-base font-bold text-slate-900 group-hover:text-orange-600">
              {tour.title}
            </h3>

            {/* Duration */}
            <p className="mt-2 text-sm text-slate-600">{tour.duration}</p>

            {/* Short Description */}
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{tour.shortDesc}</p>

            {/* Rating & Reviews */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
              <div className="flex items-center gap-1">
                <svg className="h-4 w-4 fill-amber-400" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="font-semibold text-slate-900">{tour.rating.toFixed(1)}</span>
              </div>
              <p className="text-xs text-slate-500">({tour.totalReviews} đánh giá)</p>
            </div>

            {/* CTA Button */}
            <div className="mt-4">
              <span className="block w-full rounded-lg bg-orange-500 py-2 text-center font-semibold text-white">
                Xem Chi Tiết
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

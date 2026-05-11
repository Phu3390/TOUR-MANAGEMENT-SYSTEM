import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMe } from '../../../api/tour/review.api'
import type { ReviewResponse } from '../../../types/tour/review.type'

const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

function ReviewStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating}/5 sao`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${star <= Math.round(rating) ? 'fill-amber-400' : 'fill-slate-200'}`}
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: ReviewResponse }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link to={`/client/tours/${review.tour.id}`} className="font-semibold text-slate-900 transition hover:text-blue-700">
            {review.tour.title}
          </Link>
          <p className="mt-1 text-xs text-slate-500">{formatDate(review.createdAt)}</p>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-amber-700 shadow-sm">
          {review.rating}/5
        </span>
      </div>

      <div className="mt-3">
        <ReviewStars rating={review.rating} />
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{review.content}</p>
        {review.imageUrl && (
          <img
            src={review.imageUrl}
            alt="Review"
            className="mt-3 h-32 w-full rounded-lg border border-slate-200 object-cover"
          />
        )}
      </div>
    </article>
  )
}

export default function PersonalReviewsSection() {
  const [reviews, setReviews] = useState<ReviewResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await getMe()
        if (response.code !== 200 || !response.data) {
          throw new Error(response.message || 'Không thể tải danh sách đánh giá')
        }

        setReviews(response.data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Không thể tải danh sách đánh giá'
        setError(message)
        setReviews([])
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const totalReviews = useMemo(() => reviews.length, [reviews])

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Đánh giá của tôi</h2>
          <p className="mt-1 text-sm text-slate-600">{totalReviews} đánh giá đã gửi</p>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-slate-500">
            Đang tải đánh giá...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-slate-500">
            Bạn chưa có đánh giá nào.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

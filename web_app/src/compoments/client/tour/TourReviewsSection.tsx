import { useEffect, useMemo, useState } from 'react'
import { filterReviews } from '../../../api/tour/review.api'
import type { ReviewResponse } from '../../../types/tour/review.type'

type Props = {
  tourId: string
  totalReviews?: number
  averageRating?: number
}

const ratingOptions = [1, 2, 3, 4, 5]

const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${value.toFixed(1)} sao`}>
      {ratingOptions.map((star) => (
        <svg
          key={star}
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${star <= Math.round(value) ? 'fill-amber-400' : 'fill-slate-200'}`}
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: ReviewResponse }) {
  const initials = review.reviewerName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {initials || 'KH'}
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">{review.reviewerName}</h3>
            <p className="text-sm text-slate-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>

        <div className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
          {review.rating}/5
        </div>
      </div>

      <div className="mt-4">
        <StarRating value={review.rating} />
        <p className="mt-3 text-sm leading-7 text-slate-600">{review.content}</p>
        {review.imageUrl && (
          <img
            src={review.imageUrl}
            alt="Review"
            className="mt-4 max-h-64 w-full rounded-lg border border-slate-200 object-cover"
          />
        )}
      </div>
    </article>
  )
}

export default function TourReviewsSection({ tourId, totalReviews, averageRating }: Props) {
  const [draftMinRating, setDraftMinRating] = useState(1)
  const [draftMaxRating, setDraftMaxRating] = useState(5)
  const [minRating, setMinRating] = useState(1)
  const [maxRating, setMaxRating] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)
  const [size] = useState(5)
  const [reviews, setReviews] = useState<ReviewResponse[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentTotalReviews, setCurrentTotalReviews] = useState(totalReviews ?? 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        setError(null)
        setCurrentTotalReviews(totalReviews ?? 0)

        const response = await filterReviews({
          tourId,
          minRating,
          maxRating,
          pageNumber,
          size,
          sortBy: 'createdAt',
          sortDir: 'desc',
        })

        if (response.code !== 200 || !response.data) {
          throw new Error(response.message || 'Không thể tải danh sách đánh giá')
        }

        setReviews(response.data.content ?? [])
        setTotalPages(response.data.totalPages ?? 0)
        setCurrentTotalReviews(response.data.totalElements ?? 0)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Không thể tải danh sách đánh giá'
        setError(message)
        setReviews([])
        setTotalPages(0)
      } finally {
        setLoading(false)
      }
    }

    if (tourId) {
      fetchReviews()
    }
  }, [maxRating, minRating, pageNumber, size, totalReviews, tourId])

  const normalizedRange = useMemo(() => {
    const lower = Math.min(draftMinRating, draftMaxRating)
    const upper = Math.max(draftMinRating, draftMaxRating)
    return { lower, upper }
  }, [draftMaxRating, draftMinRating])

  const applyFilters = () => {
    setMinRating(normalizedRange.lower)
    setMaxRating(normalizedRange.upper)
    setPageNumber(0)
  }

  const canGoPrev = pageNumber > 0
  const canGoNext = pageNumber + 1 < totalPages

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Đánh giá khách hàng</h2>
          <p className="mt-2 text-sm text-slate-600">
            {currentTotalReviews} đánh giá • Điểm trung bình {averageRating?.toFixed(1) || '0.0'}/5
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-130">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-600">Từ sao</span>
            <select
              value={draftMinRating}
              onChange={(e) => setDraftMinRating(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {ratingOptions.map((star) => (
                <option key={star} value={star}>
                  {star} sao
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-600">Đến sao</span>
            <select
              value={draftMaxRating}
              onChange={(e) => setDraftMaxRating(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {ratingOptions.map((star) => (
                <option key={star} value={star}>
                  {star} sao
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={applyFilters}
            className="mt-auto rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Lọc đánh giá
          </button>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-200 py-12 text-slate-500">
            Đang tải đánh giá...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-slate-500">
            Chưa có đánh giá nào phù hợp với bộ lọc này.
          </div>
        ) : (
          <div className="grid gap-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Trang {pageNumber + 1} / {Math.max(totalPages, 1)}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={!canGoPrev}
            onClick={() => setPageNumber((current) => Math.max(0, current - 1))}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Trang trước
          </button>
          <button
            type="button"
            disabled={!canGoNext}
            onClick={() => setPageNumber((current) => current + 1)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
      </div>
    </section>
  )
}
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getById } from '../../api/tour/tour.api'
import { TourDetailStatus } from '../../types/enums/TourDetailStatus.enum'
import type { TourResponse } from '../../types/tour/tour.type'
import {
  getPriceTypeLabel,
  getTourTypeLabel,
} from '../../utils/enumTranslation'

const formatVnd = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(value)

const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

const getDurationDays = (start: string | Date, end: string | Date) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diff = endDate.getTime() - startDate.getTime()
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1)
}

export default function ClientTourDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [tour, setTour] = useState<TourResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTour = async () => {
      if (!id) {
        setError('Tour không hợp lệ')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await getById(id)

        if (response.code !== 200 || !response.data) {
          throw new Error(response.message || 'Không thể tải chi tiết tour')
        }

        setTour(response.data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Không thể tải chi tiết tour'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchTour()
  }, [id])

  const sortedDetails = useMemo(() => {
    const details = (tour?.tourDetails || []).filter((detail) => detail.status === TourDetailStatus.ACTIVE)
    return [...details].sort(
      (a, b) => new Date(a.startDay).getTime() - new Date(b.startDay).getTime(),
    )
  }, [tour?.tourDetails])

  const coverImages = useMemo(() => {
    const galleryImages = tour?.gallery || []
    const merged = [tour?.imageUrl, ...galleryImages].filter(Boolean) as string[]
    return merged.slice(0, 3)
  }, [tour?.gallery, tour?.imageUrl])

  const allItineraries = useMemo(() => {
    const map = new Map<number, { dayNumber: number; title: string; content: string }>()

    for (const detail of sortedDetails) {
      for (const item of detail.tourItineraries || []) {
        if (!map.has(item.dayNumber)) {
          map.set(item.dayNumber, {
            dayNumber: item.dayNumber,
            title: item.title,
            content: item.content,
          })
        }
      }
    }

    return [...map.values()].sort((a, b) => a.dayNumber - b.dayNumber)
  }, [sortedDetails])

  const minAdultPrice = useMemo(() => {
    const prices = sortedDetails
      .flatMap((detail) => detail.tourPrices || [])
      .filter((item) => item.priceType === 'ADULT')
      .map((item) => item.price)

    return prices.length > 0 ? Math.min(...prices) : undefined
  }, [sortedDetails])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
        <p className="text-slate-600">Đang tải chi tiết tour...</p>
      </div>
    )
  }

  if (error || !tour) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
          <p className="text-rose-700">{error || 'Không tìm thấy tour'}</p>
          <Link
            to="/client/tours"
            className="mt-4 inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Quay lại danh sách tour
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/client/tours" className="mb-5 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700">
          ← Quay lại danh sách tour
        </Link>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-1 md:grid-cols-3">
            <div className="md:col-span-2">
              <img
                src={coverImages[0] || tour.imageUrl}
                alt={tour.title}
                className="h-72 w-full object-cover md:h-105"
              />
            </div>
            <div className="grid gap-1">
              <img
                src={coverImages[1] || tour.imageUrl}
                alt={`${tour.title} 1`}
                className="h-36 w-full object-cover md:h-52.25"
              />
              <img
                src={coverImages[2] || tour.imageUrl}
                alt={`${tour.title} 2`}
                className="h-36 w-full object-cover md:h-52.25"
              />
            </div>
          </div>

          <div className="space-y-4 p-6">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-rose-50 px-3 py-1 font-semibold text-rose-700">
                ⭐ {tour.rating?.toFixed(1) || '0.0'} ({tour.totalReviews || 0} đánh giá)
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">{tour.duration}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">{tour.location}</span>
              <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                {getTourTypeLabel(tour.tourType)}
              </span>
              {minAdultPrice !== undefined && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                  Từ {formatVnd(minAdultPrice)}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">{tour.title}</h1>
            <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
              <p><span className="font-semibold">Mã tour:</span> {tour.slug}</p>
              <p><span className="font-semibold">Tạo lúc:</span> {formatDate(tour.createdAt)}</p>
              <p><span className="font-semibold">Cập nhật:</span> {formatDate(tour.updatedAt)}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-slate-700">
              <h2 className="mb-2 text-2xl font-semibold text-slate-900">Tổng quan</h2>
              <p className="text-sm leading-7">{tour.shortDesc}</p>
              {tour.longDesc && <p className="mt-3 text-sm leading-7">{tour.longDesc}</p>}

            <Link
              to={`/client/tours/${id}/booking`}
              className="block w-full rounded-lg bg-orange-600 py-3 text-center font-bold text-white hover:bg-orange-700"
            >
              Đặt tour ngay
            </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-semibold text-slate-900">Lịch trình</h2>

          {allItineraries.length === 0 ? (
            <p className="mt-3 text-slate-600">Hiện chưa có lịch trình cho tour này.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {allItineraries.map((item) => (
                <article key={item.dayNumber} className="relative rounded-xl border border-slate-200 bg-slate-50 p-5 pl-10">
                  <span className="absolute left-4 top-6 h-3 w-3 rounded-full bg-blue-500"></span>
                  <h3 className="text-xl font-semibold text-slate-900">Ngày {item.dayNumber}: {item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.content}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-semibold text-slate-900">Lịch khởi hành</h2>

          {sortedDetails.length === 0 ? (
            <p className="mt-3 text-slate-600">Hiện chưa có lịch khởi hành cho tour này.</p>
          ) : (
            <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-180 text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Ngày đi</th>
                    <th className="px-4 py-3 font-semibold">Điểm khởi hành</th>
                    <th className="px-4 py-3 font-semibold">Thời lượng</th>
                    <th className="px-4 py-3 font-semibold">Số chỗ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sortedDetails.map((detail) => {
                    return (
                      <tr key={detail.id} className="bg-white">
                        <td className="px-4 py-3 text-slate-700">
                          {formatDate(detail.startDay)} - {formatDate(detail.endDay)}
                        </td>
                        <td className="px-4 py-3 text-slate-700">{detail.startLocation}</td>
                        <td className="px-4 py-3 text-slate-700">{getDurationDays(detail.startDay, detail.endDay)} ngày</td>
                        <td className="px-4 py-3 text-slate-700">
                          {detail.remainingSeats} / {detail.capacity} chỗ
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Bảng Giá Theo Loại Khách</h2>
          {sortedDetails.length === 0 ? (
            <p className="mt-3 text-slate-600">Chưa có dữ liệu giá.</p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {sortedDetails.map((detail) => (
                <article key={`price-${detail.id}`} className="rounded-xl border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                    Đợt: {formatDate(detail.startDay)} - {formatDate(detail.endDay)}
                  </h3>
                  {detail.tourPrices && detail.tourPrices.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {detail.tourPrices.map((price) => (
                        <div key={price.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                          <span className="text-sm text-slate-700">{getPriceTypeLabel(price.priceType)}</span>
                          <span className="text-sm font-semibold text-blue-700">{formatVnd(price.price)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">Chưa có dữ liệu giá.</p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

    </div>
  )
}

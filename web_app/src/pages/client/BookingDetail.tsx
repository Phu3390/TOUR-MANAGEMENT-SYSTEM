import { useEffect, useState } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getById } from '../../api/booking/booking.api'
import BookingDetailView from '../../compoments/client/booking/BookingDetailView'
import type { BookingResponse } from '../../types/booking/booking.type'

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [booking, setBooking] = useState<BookingResponse | null>(null)

  useEffect(() => {
    if (!id) {
      setError('Thiếu mã booking')
      setLoading(false)
      return
    }

    let alive = true
    setLoading(true)
    setError(null)

    void getById(id)
      .then((response) => {
        if (!alive) return
        if (response.code !== 200 || !response.data) {
          throw new Error(response.message || 'Không tải được chi tiết booking')
        }
        setBooking(response.data)
      })
      .catch((err: unknown) => {
        if (!alive) return
        const message = err instanceof Error ? err.message : 'Không tải được chi tiết booking'
        setError(message)
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [id])

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const vnpay = params.get('vnpay')
    if (!vnpay) return

    if (vnpay === 'success') {
      toast.success('Thanh toán VNPay thành công')
    } else if (vnpay === 'failed') {
      toast.error('Thanh toán VNPay thất bại')
    }

    // remove query param without adding history entry
    navigate(location.pathname, { replace: true })
  }, [location.search, location.pathname, navigate])

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Chi tiết booking</h1>
            <p className="mt-1 text-sm text-slate-600">Thông tin đầy đủ của booking bạn đã chọn</p>
          </div>
          <Link
            to="/client/dashboard"
            className="inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Quay lại
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Đang tải chi tiết booking...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>
        ) : booking ? (
          <BookingDetailView booking={booking} />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Không tìm thấy dữ liệu booking.
          </div>
        )}
      </div>
    </div>
  )
}

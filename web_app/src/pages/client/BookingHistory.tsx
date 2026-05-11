import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { fetchBookingHistory, setStatusFilter } from '../../store/booking/bookingHistory'
import BookingHistoryList from '../../compoments/client/booking/BookingHistoryList'
import BookingHistoryFilters from '../../compoments/client/booking/BookingHistoryFilters'
import PersonalReviewsSection from '../../compoments/client/booking/PersonalReviewsSection'
import type { BookingStatus } from '../../types/enums/BookingStatus.enum'

export default function BookingHistoryPage() {
  const dispatch = useAppDispatch()
  const { bookings, loading, statusFilter } = useAppSelector((state) => state.bookingHistory)
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'booking' | 'reviews'>('booking')

  const token = useAppSelector((state) => state.auth.token) || localStorage.getItem('token')

  useEffect(() => {
    if (token) {
      dispatch(fetchBookingHistory())
    }
  }, [dispatch, token])

  // Check for momo or vnpay result query params and notify user
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const momo = params.get('momo')
    const vnpay = params.get('vnpay')

    if (momo === 'success') {
      toast.success('Thanh toán MOMO thành công')
      navigate(location.pathname, { replace: true })
      return
    }

    if (momo === 'failed') {
      toast.error('Thanh toán MOMO thất bại')
      navigate(location.pathname, { replace: true })
      return
    }

    if (vnpay === 'success') {
      toast.success('Thanh toán VNPAY thành công')
      navigate(location.pathname, { replace: true })
      return
    }

    if (vnpay === 'failed') {
      toast.error('Thanh toán VNPAY thất bại')
      navigate(location.pathname, { replace: true })
      return
    }
  }, [location.search, location.pathname, navigate])

  const handleStatusFilterChange = (status: 'ALL' | BookingStatus) => {
    dispatch(setStatusFilter(status))
  }

  const totalBookings = bookings.length
  const confirmedCount = bookings.filter((b) => b.status === 'CONFIRMED').length
  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Lịch sử đặt tour</h1>
          <p className="mt-2 text-slate-600">Xem và quản lý tất cả các đơn đặt tour của bạn</p>
        </div>

        <div className="mb-6 inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('booking')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === 'booking'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Lịch sử booking
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === 'reviews'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Lịch sử đánh giá
          </button>
        </div>

        {activeTab === 'booking' ? (
          <>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-sm font-medium text-slate-600">Tổng đơn</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{totalBookings}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-sm font-medium text-slate-600">Đã xác nhận</p>
                <p className="mt-2 text-2xl font-bold text-green-600">{confirmedCount}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-sm font-medium text-slate-600">Chờ xác nhận</p>
                <p className="mt-2 text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              <div className="lg:col-span-1">
                <BookingHistoryFilters
                  selectedStatus={statusFilter}
                  onStatusChange={handleStatusFilterChange}
                />
              </div>

              <div className="lg:col-span-3">
                <BookingHistoryList
                  bookings={bookings}
                  statusFilter={statusFilter}
                  isLoading={loading}
                />
              </div>
            </div>
          </>
        ) : (
          <PersonalReviewsSection />
        )}

        {/* Error Display */}
        {/* Uncomment if needed:
        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )} */}
      </div>
    </div>
  )
}

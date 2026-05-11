import type { BookingResponse } from '../../../types/booking/booking.type'
import { BookingStatus } from '../../../types/enums/BookingStatus.enum'
import BookingHistoryCard from './BookingHistoryCard'

type Props = {
  bookings: BookingResponse[]
  statusFilter: 'ALL' | BookingStatus
  isLoading: boolean
}

export default function BookingHistoryList({ bookings, statusFilter, isLoading }: Props) {
  const filteredBookings = statusFilter === 'ALL'
    ? bookings
    : bookings.filter((booking) => booking.status === statusFilter)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg border border-slate-200 bg-slate-100 h-48" />
        ))}
      </div>
    )
  }

  if (filteredBookings.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
        <div className="text-4xl mb-2">📦</div>
        <p className="text-slate-600 font-medium">Không có booking nào</p>
        <p className="text-slate-500 text-sm mt-1">Hãy đặt tour để xem lịch sử booking</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {filteredBookings.map((booking) => (
        <BookingHistoryCard key={booking.id} booking={booking} />
      ))}
    </div>
  )
}

import { BookingStatus } from '../../../types/enums/BookingStatus.enum'

type Props = {
  selectedStatus: 'ALL' | BookingStatus
  onStatusChange: (status: 'ALL' | BookingStatus) => void
}

const statusOptions = [
  { value: 'ALL' as const, label: 'Tất cả' },
  { value: BookingStatus.PENDING, label: 'Chờ xác nhận' },
  { value: BookingStatus.CONFIRMED, label: 'Đã xác nhận' },
  { value: BookingStatus.CANCELLED, label: 'Đã hủy' },
  { value: BookingStatus.EXPIRED, label: 'Đã hết hạn' },
]

export default function BookingHistoryFilters({ selectedStatus, onStatusChange }: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Lọc theo trạng thái</h3>
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedStatus === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

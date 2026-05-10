import type { VoucherResponse } from '../../../types/booking/voucher.type'

type VoucherListProps = {
  vouchers: VoucherResponse[]
  loading: boolean
  onEdit?: (id: string) => void
  onChangeStatus?: (id: string, status: string) => void
}

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

function formatDate(value: Date | string | undefined) {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function getStatusClass(status: string) {
  const cleanStatus = status?.trim?.() ?? ''
  switch (cleanStatus) {
    case 'ACTIVE':
      return 'bg-emerald-50 text-emerald-700'
    case 'INACTIVE':
      return 'bg-rose-50 text-rose-700'
    case 'EXPIRED':
      return 'bg-rose-50 text-rose-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function getStatusLabel(status: string) {
  const cleanStatus = status?.trim?.() ?? ''
  const labels: Record<string, string> = {
    ACTIVE: 'Hoạt động',
    INACTIVE: 'Ngưng hoạt động',
    EXPIRED: 'Hết hạn',
  }
  return labels[cleanStatus] || cleanStatus
}

export default function VoucherList({ vouchers, loading, onEdit, onChangeStatus }: VoucherListProps) {
  const statusOptions = [
    { value: 'ACTIVE', label: 'Hoạt động' },
    { value: 'INACTIVE', label: 'Ngưng hoạt động' },
  ]

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Mã voucher</th>
              <th className="px-4 py-3">Phần trăm giảm</th>
              <th className="px-4 py-3">Số tiền giảm</th>
              <th className="px-4 py-3">Số lượng</th>
              <th className="px-4 py-3">Ngày bắt đầu</th>
              <th className="px-4 py-3">Ngày kết thúc</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Ngày tạo</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                  Đang tải...
                </td>
              </tr>
            ) : vouchers.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                  Không có voucher nào
                </td>
              </tr>
            ) : (
              vouchers.map((voucher) => (
                <tr key={voucher.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3 font-semibold text-slate-700">{voucher.code}</td>
                  <td className="px-4 py-3 text-slate-700">{voucher.discountPercent || 0}%</td>
                  <td className="px-4 py-3 text-slate-700">{currencyFormatter.format(voucher.discountAmount || 0)}</td>
                  <td className="px-4 py-3 text-slate-700">{voucher.quantity}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(voucher.startDate)}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(voucher.endDate)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusClass(voucher.status)}`}>
                      {getStatusLabel(voucher.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(voucher.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(voucher.id)}
                          className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50 whitespace-nowrap"
                        >
                          Sửa
                        </button>
                      )}
                      {onChangeStatus && (
                        <select
                          value={voucher.status?.trim?.() || 'ACTIVE'}
                          onChange={(event) => onChangeStatus(voucher.id, event.target.value)}
                          className="min-w-35 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

import type { TourResponse } from '../../../types/tour/tour.type'
import { TourStatus } from '../../../types/enums/TourStatus.enum'

interface TourListProps {
  tours: TourResponse[]
  loading: boolean
  onDetail?: (tour: TourResponse) => void
  onEdit?: (tour: TourResponse) => void
  onStatusToggle?: (tour: TourResponse, nextStatus: TourStatus) => void
  updatingTourId?: string | null
}

export default function TourList({ tours, loading, onDetail, onEdit, onStatusToggle, updatingTourId }: TourListProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
              <th className="w-1/3 px-6 py-4">Thông tin tour</th>
              <th className="w-1/4 px-6 py-4">Vị trí</th>
              <th className="w-1/6 px-6 py-4">Đánh giá</th>
              <th className="w-1/6 px-6 py-4">Trạng thái</th>
              <th className="w-1/6 px-6 py-4">Loại</th>
              <th className="w-1/6 px-6 py-4 text-right">Thao tác</th>
          </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : tours.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  Không có tour nào
                </td>
              </tr>
            ) : (
              tours.map((tour) => (
                <tr key={tour.id} className="transition-colors hover:bg-slate-50/80">
                  <td className="w-1/3 px-6 py-4">
                    <div className="flex items-center gap-3">
                      {tour.imageUrl ? (
                        <img src={tour.imageUrl} alt={tour.title} className="h-12 w-12 rounded-xl object-cover" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-500">
                          T
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800">{tour.title}</p>
                        <p className="truncate text-xs text-slate-500">{tour.slug}</p>
                      </div>
                    </div>
                  </td>

                  <td className="w-1/4 px-6 py-4">
                    <p className="font-medium text-slate-700">{tour.location}</p>
                    <p className="text-xs text-slate-500">{tour.duration}</p>
                  </td>

                  <td className="w-1/6 px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-800">{tour.rating === null ? 0 : tour.rating}/5</p>
                      <p className="text-xs text-slate-500">{tour.totalReviews === null ? 0 : tour.totalReviews} đánh giá</p>
                    </div>
                  </td>

                  <td className="w-1/6 px-6 py-4">
                    <RoleLikeStatus status={tour.status} />
                  </td>

                  <td className="w-1/6 px-6 py-4">
                    <p className="font-medium text-slate-700">{getTourTypeLabel(tour.tourType)}</p>
                  </td>

                  <td className="w-1/6 px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onDetail?.(tour)}
                        className="whitespace-nowrap rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                      >
                        Chi tiết
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit?.(tour)}
                        className="whitespace-nowrap rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                      >
                        Sửa
                      </button>
                      <select
                        value={tour.status}
                        disabled={updatingTourId === tour.id}
                        onChange={(event) => onStatusToggle?.(tour, event.target.value as TourStatus)}
                        className="min-w-28 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value={TourStatus.DRAFT}>Bản nháp</option>
                        <option value={TourStatus.ACTIVE}>Hoạt động</option>
                        <option value={TourStatus.INACTIVE}>Ngưng hoạt động</option>
                      </select>
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

function RoleLikeStatus({ status }: { status: string }) {
  return <span className={`inline-flex items-center gap-2 text-sm font-medium ${getStatusColor(status)}`}><span className={`h-2 w-2 rounded-full ${getStatusDot(status)}`} />{getStatusLabel(status)}</span>
}

function getStatusLabel(status: string) {
  if (status === 'ACTIVE') return 'Hoạt động'
  if (status === 'DRAFT') return 'Bản nháp'
  return 'Ngưng hoạt động'
}

function getStatusColor(status: string) {
  if (status === 'ACTIVE') return 'text-emerald-700'
  if (status === 'DRAFT') return 'text-amber-700'
  return 'text-rose-700'
}

function getStatusDot(status: string) {
  if (status === 'ACTIVE') return 'bg-emerald-600'
  if (status === 'DRAFT') return 'bg-amber-600'
  return 'bg-rose-600'
}

function getTourTypeLabel(type: string) {
  if (type === 'ADVENTURE') return 'Phiêu lưu'
  if (type === 'RELAX') return 'Nghỉ dưỡng'
  if (type === 'FAMILY') return 'Gia đình'
  if (type === 'LUXURY') return 'Cao cấp'
  if (type === 'CULTURE') return 'Văn hóa'
  return type
}

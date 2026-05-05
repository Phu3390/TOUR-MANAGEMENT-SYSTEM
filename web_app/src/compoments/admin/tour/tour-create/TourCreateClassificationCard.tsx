import { TourStatus } from '../../../../types/enums/TourStatus.enum'
import { TourType } from '../../../../types/enums/TourType.enum'
import type { TourCreateTourDraft } from '../../../../types/tour/tour-create.type'

interface TourCreateClassificationCardProps {
  value: Pick<TourCreateTourDraft, 'tourType' | 'status'>
  onChange: (patch: Partial<Pick<TourCreateTourDraft, 'tourType' | 'status'>>) => void
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

const tourTypeOptions = [
  { value: TourType.RELAX, label: 'Nghỉ dưỡng' },
  { value: TourType.ADVENTURE, label: 'Phiêu lưu' },
  { value: TourType.FAMILY, label: 'Gia đình' },
  { value: TourType.LUXURY, label: 'Cao cấp' },
  { value: TourType.CULTURE, label: 'Văn hóa' },
]

const statusOptions = [
  { value: TourStatus.DRAFT, label: 'Bản nháp' },
  { value: TourStatus.ACTIVE, label: 'Hoạt động' },
  { value: TourStatus.INACTIVE, label: 'Ngưng hoạt động' },
]

export default function TourCreateClassificationCard({ value, onChange }: TourCreateClassificationCardProps) {
  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Phân loại</h2>
        <p className="text-sm text-slate-500">Chọn loại tour và trạng thái khởi tạo.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Loại tour</label>
          <select
            value={value.tourType}
            onChange={(event) => onChange({ tourType: event.target.value as TourCreateTourDraft['tourType'] })}
            className={inputClass}
          >
            {tourTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái</label>
          <select
            value={value.status}
            onChange={(event) => onChange({ status: event.target.value as TourCreateTourDraft['status'] })}
            className={inputClass}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  )
}
import type { TourCreateTourDraft } from '../../../../types/tour/tour-create.type'

interface TourCreateBasicInfoCardProps {
  value: TourCreateTourDraft
  onChange: (patch: Partial<TourCreateTourDraft>) => void
  onGenerateSlug: () => void
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

export default function TourCreateBasicInfoCard({ value, onChange, onGenerateSlug }: TourCreateBasicInfoCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Thông tin cơ bản</h2>
        <p className="text-sm text-slate-500">Nhập đầy đủ thông tin để tour hiển thị đúng ở trang danh sách.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tiêu đề tour</label>
          <input
            value={value.title}
            onChange={(event) => onChange({ title: event.target.value })}
            className={inputClass}
            placeholder="Tạo tour du lịch mới"
          />
        </div>

        <div className="md:col-span-2">
          <div className="mb-1 flex items-center justify-between gap-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Đường dẫn slug</label>
            <button
              type="button"
              onClick={onGenerateSlug}
              className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Tạo từ tiêu đề
            </button>
          </div>
          <input
            value={value.slug}
            onChange={(event) => onChange({ slug: event.target.value })}
            className={inputClass}
            placeholder="hanh-trinh-da-nang"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Địa điểm</label>
          <input
            value={value.location}
            onChange={(event) => onChange({ location: event.target.value })}
            className={inputClass}
            placeholder="Đà Nẵng, Việt Nam"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Thời lượng</label>
          <input
            value={value.duration}
            onChange={(event) => onChange({ duration: event.target.value })}
            className={inputClass}
            placeholder="4 ngày 3 đêm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mô tả ngắn</label>
          <textarea
            value={value.shortDesc}
            onChange={(event) => onChange({ shortDesc: event.target.value })}
            rows={3}
            className={inputClass}
            placeholder="Tóm tắt những điểm nổi bật nhất của tour..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mô tả chi tiết</label>
          <textarea
            value={value.longDesc}
            onChange={(event) => onChange({ longDesc: event.target.value })}
            rows={6}
            className={inputClass}
            placeholder="Viết mô tả đầy đủ về hành trình, điểm nhấn, dịch vụ và trải nghiệm."
          />
        </div>
      </div>
    </section>
  )
}
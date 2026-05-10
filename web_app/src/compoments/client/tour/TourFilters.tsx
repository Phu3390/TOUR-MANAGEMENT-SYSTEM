import { useState } from 'react'
import type { TourQueryRequest } from '../../../types/tour/tour.type'
import { TourType } from '../../../types/enums/TourType.enum'
import { getTourTypeLabel } from '../../../utils/enumTranslation'

type Props = {
  onChange: (q: TourQueryRequest) => void
  initial?: Partial<TourQueryRequest>
}

export default function TourFilters({ onChange, initial }: Props) {
  const [keyword, setKeyword] = useState(initial?.keyword || '')
  const [location, setLocation] = useState(initial?.location || '')
  const [tourType, setTourType] = useState<TourType | ''>((initial?.tourType as TourType) || '')
  const [minPrice, setMinPrice] = useState<number | undefined>(initial?.minPrice)
  const [maxPrice, setMaxPrice] = useState<number | undefined>(initial?.maxPrice)
  const [rating, setRating] = useState<number | undefined>(undefined)

  const apply = () => {
    onChange({
      keyword: keyword || undefined,
      location: location || undefined,
      tourType: tourType || undefined,
      minRating: rating,
      minPrice,
      maxPrice,
      pageNumber: 0,
      size: 6,
    })
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-slate-600">Tìm theo từ khóa</label>
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Nhập tên tour, địa điểm..." className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-600">Địa điểm</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ví dụ: Hà Nội" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600">Loại tour</label>
          <select value={tourType} onChange={(e) => setTourType((e.target.value as TourType) || '')} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="">Tất cả</option>
            {Object.values(TourType).map((type) => (
              <option key={type} value={type}>
                {getTourTypeLabel(type)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-3">Khoảng giá (VND)</label>
        <div className="grid gap-2 grid-cols-2">
          <div>
            <input type="number" value={minPrice ?? ''} onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)} placeholder="Từ" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <input type="number" value={maxPrice ?? ''} onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)} placeholder="Đến" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600">Đánh giá tối thiểu</label>
        <div className="mt-2 flex flex-wrap justify-center gap-1 sm:justify-start">
          {[0, 1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(rating === star ? undefined : star)}
              className={`flex-1 min-w-max px-2 py-2 rounded-lg border text-xs font-medium transition ${
                rating === star
                  ? 'bg-yellow-400 border-yellow-500 text-slate-900'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {star}⭐
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={apply} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Áp dụng</button>
      </div>
    </div>
  )
}

import type { TourResponse } from '../../../../types/tour/tour.type'

interface TourDetailMediaCardProps {
  tour: TourResponse
}

export default function TourDetailMediaCard({ tour }: TourDetailMediaCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Hình Ảnh</h2>
        <p className="text-sm text-slate-500">Ảnh bìa và thư viện ảnh của tour</p>
      </div>

      <div className="space-y-4">
        {tour.imageUrl && (
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ảnh bìa</label>
            <img src={tour.imageUrl} alt={tour.title} className="w-full h-80 object-cover rounded-xl shadow-sm" />
          </div>
        )}

        {tour.gallery && tour.gallery.length > 0 && (
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Thư viện ảnh ({tour.gallery.length})
            </label>
            <div className="grid grid-cols-3 gap-3">
              {tour.gallery.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg shadow-sm hover:shadow-md transition"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

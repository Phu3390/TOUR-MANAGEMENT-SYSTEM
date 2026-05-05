import type { TourDetailResponse } from '../../../../types/tour/tourdetail.type'

interface TourDetailItineraryCardProps {
  detail: TourDetailResponse
}

export default function TourDetailItineraryCard({ detail }: TourDetailItineraryCardProps) {
  if (!detail.tourItineraries || detail.tourItineraries.length === 0) {
    return null
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Lịch Trình</h2>
        <p className="text-sm text-slate-500">Chi tiết các ngày của tour</p>
      </div>

      <div className="space-y-4">
        {detail.tourItineraries.map((itinerary, idx) => (
          <div key={idx} className="relative pl-8">
            {idx < detail.tourItineraries!.length - 1 && (
              <div className="absolute left-3 top-10 w-0.5 h-12 bg-blue-200"></div>
            )}
            <div className="absolute left-0 top-1 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-sm"></div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-900 mb-2">
                Ngày {itinerary.dayNumber || idx + 1}: {itinerary.title}
              </h3>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{itinerary.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

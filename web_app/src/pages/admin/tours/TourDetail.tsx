import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getById } from '../../../api/tour/tour.api'
import type { TourResponse } from '../../../types/tour/tour.type'
import TourDetailHeader from '../../../compoments/admin/tour/tour-detail/TourDetailHeader'
import TourDetailBasicInfoCard from '../../../compoments/admin/tour/tour-detail/TourDetailBasicInfoCard'
import TourDetailMediaCard from '../../../compoments/admin/tour/tour-detail/TourDetailMediaCard'
import TourDetailClassificationCard from '../../../compoments/admin/tour/tour-detail/TourDetailClassificationCard'
import TourDetailDepartureCard from '../../../compoments/admin/tour/tour-detail/TourDetailDepartureCard'
import TourDetailPricingCard from '../../../compoments/admin/tour/tour-detail/TourDetailPricingCard'
import TourDetailItineraryCard from '../../../compoments/admin/tour/tour-detail/TourDetailItineraryCard'
import TourDetailActions from '../../../compoments/admin/tour/tour-detail/TourDetailActions'
import { getTourDetailStatusColor, getTourDetailStatusLabel } from '../../../utils/enumTranslation'

export default function TourDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [tour, setTour] = useState<TourResponse | null>(null)
  const [activeDetailIndex, setActiveDetailIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTourDetail = async () => {
      if (!id) {
        setError('ID tour không hợp lệ')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const response = await getById(id)

        if (response.code !== 200 || !response.data) {
          throw new Error(response.message || 'Không thể tải thông tin tour')
        }

        setTour(response.data)
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Lỗi khi tải tour'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTourDetail()
  }, [id])

  const handleBack = () => navigate('/admin/tours')

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 h-12 w-12"></div>
          <p className="text-slate-600">Đang tải thông tin tour...</p>
        </div>
      </div>
    )
  }

  if (error || !tour) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm max-w-md">
          <div className="text-5xl">⚠️</div>
          <p className="text-lg text-slate-700">{error || 'Không tìm thấy tour'}</p>
          <button
            onClick={handleBack}
            className="inline-block rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    )
  }

  const activeDetail = tour.tourDetails?.[activeDetailIndex]
  const activeDetailStatusBadge = activeDetail ? getTourDetailStatusColor(activeDetail.status) : null

  return (
    <div className="w-full flex justify-center pb-24">
      <div className="max-w-6xl w-full px-4 space-y-5 text-left md:px-6">
        <TourDetailHeader />

        <TourDetailBasicInfoCard tour={tour} />
        <TourDetailMediaCard tour={tour} />
        <TourDetailClassificationCard tour={tour} />

        {tour.tourDetails && tour.tourDetails.length > 0 && (
          <>
            <TourDetailDepartureCard
              details={tour.tourDetails}
              activeIndex={activeDetailIndex}
              onSelect={setActiveDetailIndex}
            />

            {activeDetail && (
              <>
                <TourDetailPricingCard detail={activeDetail} />
                <TourDetailItineraryCard detail={activeDetail} />

                {/* Additional Info */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-slate-900">Thông Tin Khác</h2>
                    <p className="text-sm text-slate-500">Chi tiết lịch khởi hành</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sức chứa</label>
                      <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                        {activeDetail.capacity} người
                      </p>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Chỗ còn lại</label>
                      <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                        {activeDetail.remainingSeats} người
                      </p>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Địa điểm khởi hành</label>
                      <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                        {activeDetail.startLocation}
                      </p>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái</label>
                      <p className={`rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium ${activeDetailStatusBadge?.bg || 'bg-slate-50'} ${activeDetailStatusBadge?.text || 'text-slate-700'}`}>
                        {getTourDetailStatusLabel(activeDetail.status)}
                      </p>
                    </div>
                  </div>
                </section>
              </>
            )}
          </>
        )}

        <TourDetailActions onBack={handleBack} />
      </div>
    </div>
  )
}

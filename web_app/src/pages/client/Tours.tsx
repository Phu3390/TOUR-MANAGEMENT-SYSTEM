import { useEffect, useState } from 'react'
import TourFilters from '../../compoments/client/tour/TourFilters'
import TourCard from '../../compoments/client/tour/TourCard'
import TourPagination from '../../compoments/client/tour/TourPagination'
import { filterTours } from '../../api/tour/tour.api'
import type { TourQueryRequest } from '../../types/tour/tour.type'

export default function ToursPage() {
  const [query, setQuery] = useState<TourQueryRequest>({ pageNumber: 0, size: 6 })
  const [tours, setTours] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pageNumber, setPageNumber] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const payload = { ...query, pageNumber, size: query.size }
        const res = await filterTours(payload)
        const page = res.data
        setTours(page?.content || [])
        setTotalPages(page?.totalPages || 0)
      } catch (e) {
        setError('Không thể tải danh sách tour')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [query, pageNumber])

  const handleFilterChange = (q: TourQueryRequest) => {
    setQuery((prev) => ({ ...prev, ...q }))
    setPageNumber(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold text-white">Khám Phá Các Tour Du Lịch</h1>
          <p className="mt-3 text-lg text-blue-50">Tìm tour hoàn hảo cho chuyến du lịch của bạn</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar Filters */}
          <aside className="col-span-1">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="mb-6 text-xl font-bold text-slate-900">Bộ Lọc</h2>
              <TourFilters onChange={handleFilterChange} initial={{ keyword: query.keyword }} />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="col-span-3">
            {/* Results Header */}
            <div className="mb-8 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
              <div className="text-sm font-medium text-slate-700">
                Hiển thị <span className="font-bold text-blue-600">{tours.length}</span> kết quả
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 mx-auto"></div>
                  <p className="text-slate-600">Đang tải tour...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="rounded-lg bg-rose-50 p-6 text-center">
                <p className="text-rose-700 font-medium">{error}</p>
              </div>
            )}

            {/* Tours Grid */}
            {!loading && !error && (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-12 flex justify-center">
                  <TourPagination current={pageNumber} totalPages={totalPages} onChange={(p) => setPageNumber(p)} />
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

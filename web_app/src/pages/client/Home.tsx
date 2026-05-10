import { Link } from 'react-router-dom'
import HeroBanner from '../../compoments/HeroBanner'
import FeaturedTours from '../../compoments/FeaturedTours'
import Testimonials from '../../compoments/Testimonials'

export default function ClientHome() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="w-full">
        <HeroBanner />
      </div>

      {/* Featured Tours Section */}
      <div className="border-t border-slate-200 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-slate-900">Tour Nổi Bật</h2>
            <p className="mt-3 text-lg text-slate-600">Những chuyến tour được đánh giá cao nhất từ khách hàng</p>
          </div>
          <FeaturedTours />
        </div>
      </div>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <div className="border-t border-slate-200 bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-bold text-slate-900">Khám phá thế giới cùng TourTravel</h2>
          <p className="mt-4 text-lg text-slate-600">Tìm tour theo địa điểm, thời lượng và mức giá phù hợp với bạn.</p>
          <div className="mt-8">
            <Link to="/client/tours" className="inline-flex rounded-md bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700">Xem tất cả tour</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      location: 'Hà Nội',
      avatar: 'https://via.placeholder.com/60x60?text=Avatar1',
      rating: 5,
      comment: 'Tour rất tuyệt vời! Hướng dẫn viên nhiệt tình, mọi thứ được sắp xếp rất chu đáo. Tôi rất hài lòng và sẽ giới thiệu cho bạn bè.',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      location: 'TP.HCM',
      avatar: 'https://via.placeholder.com/60x60?text=Avatar2',
      rating: 5,
      comment: 'Chuyến tour Vịnh Hạ Long là trải nghiệm không thể quên. Phong cảnh đẹp tuyệt vời, dịch vụ chuyên nghiệp, giá cả hợp lý.',
    },
    {
      id: 3,
      name: 'Lê Minh C',
      location: 'Đà Nẵng',
      avatar: 'https://via.placeholder.com/60x60?text=Avatar3',
      rating: 5,
      comment: 'TourTravel là lựa chọn tốt nhất cho gia đình tôi. Mọi thứ đều hoàn hảo từ khách sạn đến các bữa ăn. Cảm ơn đội ngũ!',
    },
  ]

  return (
    <section className="border-t border-slate-200 bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-slate-900">Khách Hàng Nói Gì Về Chúng Tôi</h2>
          <p className="mt-3 text-lg text-slate-600">Những nhận xét từ khách hàng đã trải nghiệm tour của TourTravel</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              {/* Star Rating */}
              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 fill-amber-400" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Comment */}
              <p className="mt-4 text-slate-600">&quot;{testimonial.comment}&quot;</p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

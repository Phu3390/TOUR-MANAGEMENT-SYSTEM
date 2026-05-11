import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type BannerSlide = {
  id: number
  image: string
  title: string
  description: string
}

const slides: BannerSlide[] = [
  {
    id: 1,
    image: '/images/banner-1.jpg',
    title: 'Khám phá những thác nước kỳ vĩ',
    description: 'Hành trình đến với những điều kỳ diệu của thiên nhiên Việt Nam',
  },
  {
    id: 2,
    image: '/images/banner-2.jpg',
    title: 'Du lịch Vịnh Hạ Long huyền ảo',
    description: 'Trải nghiệm vẻ đẹp kỳ thú của di sản thế giới',
  },
  {
    id: 3,
    image: '/images/banner-3.jpg',
    title: 'Vịnh Hạ Long - Ấn tượng từ trên cao',
    description: 'Những khoảnh khắc đẹp mê hồn chỉ có ở đây',
  },
]

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <div className="relative w-full overflow-hidden bg-slate-900 shadow-lg">
      {/* Slides Container */}
      <div className="relative h-96 sm:h-125 lg:h-150">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Text Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="mt-3 text-base sm:text-lg drop-shadow-md">
                {slide.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Button */}
      <Link
        to="/client/tours"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 inline-flex rounded-full bg-orange-500 px-6 py-3 text-base font-bold text-white transition hover:bg-orange-600 shadow-lg"
      >
        Đặt Tour Ngay
      </Link>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/30 text-white transition hover:bg-white/50"
        aria-label="Previous slide"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        type="button"
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/30 text-white transition hover:bg-white/50"
        aria-label="Next slide"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 19L16 12L9 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition ${
              index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

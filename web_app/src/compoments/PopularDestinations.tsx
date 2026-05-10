import { Link } from 'react-router-dom'

export default function PopularDestinations() {
  const destinations = [
    {
      id: 1,
      name: 'Vịnh Hạ Long',
      image: 'https://via.placeholder.com/400x300?text=Ha+Long+Bay',
      tours: 45,
    },
    {
      id: 2,
      name: 'Sa Pa',
      image: 'https://via.placeholder.com/400x300?text=Sapa',
      tours: 32,
    },
    {
      id: 3,
      name: 'Đà Nẵng',
      image: 'https://via.placeholder.com/400x300?text=Da+Nang',
      tours: 28,
    },
    {
      id: 4,
      name: 'Hà Nội',
      image: 'https://via.placeholder.com/400x300?text=Hanoi',
      tours: 38,
    },
    {
      id: 5,
      name: 'Nha Trang',
      image: 'https://via.placeholder.com/400x300?text=Nha+Trang',
      tours: 26,
    },
    {
      id: 6,
      name: 'Phú Quốc',
      image: 'https://via.placeholder.com/400x300?text=Phu+Quoc',
      tours: 22,
    },
  ]

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-slate-900">Điểm Đến Nổi Tiếng</h2>
          <p className="mt-3 text-lg text-slate-600">Những địa điểm du lịch được yêu thích nhất</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <Link
              key={destination.id}
              to="/client/tours"
              className="group relative overflow-hidden rounded-lg shadow-md transition hover:shadow-xl"
            >
              {/* Image */}
              <img
                src={destination.image}
                alt={destination.name}
                className="h-64 w-full object-cover transition group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-end justify-between p-4">
                <div />
                <div className="text-right">
                  <h3 className="text-2xl font-bold text-white">{destination.name}</h3>
                  <p className="text-sm text-blue-100">{destination.tours} tours</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

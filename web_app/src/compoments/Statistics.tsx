export default function Statistics() {
  const stats = [
    {
      label: 'Tours Nổi Bật',
      value: '500+',
      icon: '🎫',
    },
    {
      label: 'Khách Hàng Hạnh Phúc',
      value: '50K+',
      icon: '😊',
    },
    {
      label: 'Điểm Đến',
      value: '100+',
      icon: '📍',
    },
    {
      label: 'Đánh Giá 5 Sao',
      value: '4.8/5',
      icon: '⭐',
    },
  ]

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="rounded-lg bg-white/10 p-6 text-center backdrop-blur-sm">
              <div className="text-4xl">{stat.icon}</div>
              <div className="mt-3 text-3xl font-bold text-white">{stat.value}</div>
              <div className="mt-2 text-sm text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

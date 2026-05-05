import type { TourDetailResponse } from '../../../../types/tour/tourdetail.type'
import { getPriceTypeLabel } from '../../../../utils/enumTranslation'

interface TourDetailPricingCardProps {
  detail: TourDetailResponse
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price)
}

export default function TourDetailPricingCard({ detail }: TourDetailPricingCardProps) {
  if (!detail.tourPrices || detail.tourPrices.length === 0) {
    return null
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Bảng Giá</h2>
        <p className="text-sm text-slate-500">Giá theo loại khách</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Loại khách</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Giá</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {detail.tourPrices.map((price, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-700">{getPriceTypeLabel(price.priceType || 'N/A')}</td>
                <td className="px-4 py-3 text-right font-semibold text-blue-600">{formatPrice(price.price || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

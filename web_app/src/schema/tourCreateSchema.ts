import { z } from 'zod'
import { TourStatus } from '../types/enums/TourStatus.enum'
import { TourType } from '../types/enums/TourType.enum'
import { TourDetailStatus } from '../types/enums/TourDetailStatus.enum'
import { PriceType } from '../types/enums/PriceType.enum'

export const TourCreateTourDraftSchema = z.object({
  title: z.string().min(1, 'Vui lòng nhập tiêu đề tour'),
  slug: z.string().min(1, 'Vui lòng nhập slug'),
  location: z.string().min(1, 'Vui lòng nhập địa điểm'),
  duration: z.string().min(1, 'Vui lòng nhập thời lượng'),
  shortDesc: z.string().min(1, 'Vui lòng nhập mô tả ngắn'),
  longDesc: z.string().min(1, 'Vui lòng nhập mô tả chi tiết'),
  imageUrl: z.string().min(1, 'Vui lòng tải ảnh bìa lên').url('Ảnh bìa không hợp lệ'),
  gallery: z.array(z.string().url('Một ảnh trong thư viện không hợp lệ')),
  tourType: z.enum([TourType.RELAX, TourType.ADVENTURE, TourType.FAMILY, TourType.LUXURY, TourType.CULTURE]),
  status: z.enum([TourStatus.DRAFT, TourStatus.ACTIVE, TourStatus.INACTIVE]),
})

export const TourPriceDraftSchema = z.object({
  priceType: z.enum([PriceType.ADULT, PriceType.CHILD]),
  price: z.string().min(1, 'Vui lòng nhập giá'),
})

export const TourItineraryDraftSchema = z.object({
  dayNumber: z.string().min(1, 'Vui lòng nhập ngày'),
  title: z.string().min(1, 'Vui lòng nhập tiêu đề ngày'),
  content: z.string().min(1, 'Vui lòng nhập nội dung ngày'),
})

export const TourDetailDraftSchema = z.object({
  startDay: z.string().min(1, 'Vui lòng chọn ngày khởi hành'),
  endDay: z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
  startLocation: z.string().min(1, 'Vui lòng nhập điểm khởi hành'),
  capacity: z.string().refine((val) => Number(val) > 0, 'Sức chứa phải lớn hơn 0'),
  remainingSeats: z.string().refine((val) => Number(val) >= 0, 'Chỗ còn trống không hợp lệ'),
  status: z.enum([TourDetailStatus.ACTIVE, TourDetailStatus.FULL, TourDetailStatus.CANCELLED]),
  prices: z.array(TourPriceDraftSchema).min(1, 'Vui lòng thêm ít nhất một dòng giá'),
  itineraries: z.array(TourItineraryDraftSchema).min(1, 'Vui lòng thêm ít nhất một ngày lịch trình'),
})

export const TourCreateFormStateSchema = z.object({
  tour: TourCreateTourDraftSchema,
  tourDetails: z.array(TourDetailDraftSchema).min(1, 'Vui lòng thêm ít nhất một đợt khởi hành'),
})

// Step-based schemas
export const Step1Schema = z.object({
  tour: TourCreateTourDraftSchema,
})

export const Step2Schema = z.object({
  tourDetails: z.array(
    z.object({
      startDay: z.string().min(1, 'Vui lòng chọn ngày khởi hành'),
      endDay: z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
      startLocation: z.string().min(1, 'Vui lòng nhập điểm khởi hành'),
      capacity: z.string().refine((val) => Number(val) > 0, 'Sức chứa phải lớn hơn 0'),
      remainingSeats: z.string().refine((val) => Number(val) >= 0, 'Chỗ còn trống không hợp lệ'),
    })
  ).min(1, 'Vui lòng thêm ít nhất một đợt khởi hành'),
})

export const Step3Schema = z.object({
  tourDetails: z.array(
    z.object({
      prices: z.array(TourPriceDraftSchema).min(1, 'Vui lòng thêm ít nhất một dòng giá'),
    })
  ).min(1, 'Vui lòng thêm ít nhất một đợt khởi hành'),
})

export const Step4Schema = z.object({
  tourDetails: z.array(
    z.object({
      itineraries: z.array(TourItineraryDraftSchema).min(1, 'Vui lòng thêm ít nhất một ngày lịch trình'),
    })
  ).min(1, 'Vui lòng thêm ít nhất một đợt khởi hành'),
})

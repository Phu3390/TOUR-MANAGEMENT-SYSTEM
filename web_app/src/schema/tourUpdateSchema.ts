import { z } from 'zod'
import { TourDetailStatus } from '../types/enums/TourDetailStatus.enum'
import { TourCreateTourDraftSchema } from './tourCreateSchema'

export const TourUpdateTourInfoSchema = TourCreateTourDraftSchema

export const TourUpdateDetailFormSchema = z.object({
  capacity: z.number().int('Sức chứa phải là số nguyên').min(1, 'Sức chứa phải lớn hơn 0'),
  remainingSeats: z.number().int('Chỗ còn lại phải là số nguyên').min(0, 'Chỗ còn lại không hợp lệ'),
  startDay: z.string().min(1, 'Vui lòng chọn ngày khởi hành'),
  endDay: z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
  startLocation: z.string().min(1, 'Vui lòng nhập điểm khởi hành'),
  status: z.enum([TourDetailStatus.ACTIVE, TourDetailStatus.FULL, TourDetailStatus.CANCELLED]),
})

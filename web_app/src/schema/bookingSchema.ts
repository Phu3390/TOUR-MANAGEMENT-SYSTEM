import { z } from 'zod'
import { PriceType } from '../types/enums/PriceType.enum'
import { PaymentMethod } from '../types/enums/PaymentMethod.enum'
import { PaymentStatus } from '../types/enums/PaymentStatus.enum'
import { BookingStatus } from '../types/enums/BookingStatus.enum'

export const bookingItemSchema = z.object({
  priceType: z.enum([PriceType.ADULT, PriceType.CHILD], {
    errorMap: () => ({ message: 'Loại khách không hợp lệ' }),
  }),
  quantity: z.number().min(0, 'Số lượng không được âm'),
  unitPrice: z.number().min(0, 'Giá không được âm'),
})

export const paymentRequestSchema = z.object({
  amount: z.number().min(0, 'Số tiền không được âm'),
  method: z.enum([PaymentMethod.MOMO, PaymentMethod.VNPAY, PaymentMethod.CASH], {
    errorMap: () => ({ message: 'Phương thức thanh toán không hợp lệ' }),
  }),
  status: z.enum([PaymentStatus.PENDING, PaymentStatus.SUCCESS, PaymentStatus.FAILED], {
    errorMap: () => ({ message: 'Trạng thái thanh toán không hợp lệ' }),
  }),
  transactionCode: z.string().min(1, 'Mã giao dịch không được để trống'),
  provider: z.string().min(1, 'Nhà cung cấp không được để trống'),
  paidAt: z.coerce.date().optional(),
})

export const bookingRequestSchema = z.object({
  tourId: z.string().min(1, 'Tour ID không được để trống'),
  tourDetailId: z.string().min(1, 'Tour detail ID không được để trống'),
  contactFullname: z.string().min(2, 'Họ tên phải ≥ 2 ký tự'),
  contactEmail: z.string().email('Email không hợp lệ'),
  contactPhone: z.string().min(9, 'Số điện thoại không hợp lệ').max(11, 'Số điện thoại không hợp lệ'),
  contactAddress: z.string().min(5, 'Địa chỉ phải ≥ 5 ký tự'),
  totalPrice: z.number().min(0, 'Giá tiền không được âm'),
  status: z.enum([BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.CANCELLED], {
    errorMap: () => ({ message: 'Trạng thái đặt tour không hợp lệ' }),
  }),
  note: z.string().optional(),
})

const baseCreateBookingSchema = z.object({
  contactFullname: z.string().min(2, 'Họ tên phải ≥ 2 ký tự'),
  contactEmail: z.string().email('Email không hợp lệ'),
  contactPhone: z.string().min(9, 'Số điện thoại không hợp lệ').max(11, 'Số điện thoại không hợp lệ'),
  contactAddress: z.string().min(5, 'Địa chỉ phải ≥ 5 ký tự'),
  status: z.enum([BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.CANCELLED], {
    errorMap: () => ({ message: 'Trạng thái đặt tour không hợp lệ' }),
  }),
  note: z.string().optional(),
  bookingItems: z.array(bookingItemSchema).min(1, 'Phải chọn ít nhất 1 loại khách'),
  paymentRequests: z.array(paymentRequestSchema).min(1, 'Phải thêm ít nhất 1 phương thức thanh toán'),
  code: z.string().optional(),
})

export type CreateBookingSchemaOptions = {
  remainingSeats?: number
  allowChild?: boolean
}

export const buildCreateBookingSchema = (options?: CreateBookingSchemaOptions) =>
  baseCreateBookingSchema.superRefine((data, ctx) => {
    const totalTravelers = data.bookingItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0)

    if (totalTravelers <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['bookingItems'],
        message: 'Phải chọn ít nhất 1 khách',
      })
    }

    if (
      typeof options?.remainingSeats === 'number' &&
      options.remainingSeats >= 0 &&
      totalTravelers > options.remainingSeats
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['bookingItems'],
        message: `Số khách vượt quá số chỗ còn lại (${options.remainingSeats})`,
      })
    }

    if (options?.allowChild === false) {
      const childCount = data.bookingItems
        .filter((item) => item.priceType === PriceType.CHILD)
        .reduce((sum, item) => sum + Number(item.quantity || 0), 0)

      if (childCount > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['bookingItems'],
          message: 'Đợt tour này không áp dụng vé trẻ em',
        })
      }
    }
  })

export const createBookingSchema = buildCreateBookingSchema()

export type BookingItemInput = z.infer<typeof bookingItemSchema>
export type PaymentRequestInput = z.infer<typeof paymentRequestSchema>
export type BookingRequestInput = z.infer<typeof bookingRequestSchema>
export type CreateBookingInput = z.infer<typeof createBookingSchema>

export const bookingFilterSchema = z
  .object({
    keyword: z.string().trim().max(120, 'Tu khoa khong duoc qua 120 ky tu').optional().default(''),
    bookingStatus: z.enum(['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED']).default('ALL'),
    paymentStatus: z.enum(['ALL', 'PENDING', 'SUCCESS', 'FAILED']).default('ALL'),
    paymentMethod: z.enum(['ALL', 'VNPAY', 'MOMO', 'CASH']).default('ALL'),
    minTotalPrice: z
      .string()
      .trim()
      .optional()
      .default('')
      .refine((value) => value === '' || Number(value) >= 0, 'Gia tri toi thieu khong hop le'),
    maxTotalPrice: z
      .string()
      .trim()
      .optional()
      .default('')
      .refine((value) => value === '' || Number(value) >= 0, 'Gia tri toi da khong hop le'),
    expiredOnly: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.minTotalPrice || !data.maxTotalPrice) return true
      return Number(data.minTotalPrice) <= Number(data.maxTotalPrice)
    },
    {
      path: ['maxTotalPrice'],
      message: 'Gia tri toi da phai lon hon hoac bang gia tri toi thieu',
    },
  )

export type BookingFilterValues = z.infer<typeof bookingFilterSchema>

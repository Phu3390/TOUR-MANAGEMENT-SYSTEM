import { z } from 'zod'

export const voucherFilterSchema = z
  .object({
    keyword: z.string().trim().max(100, 'Từ khóa không được quá 100 ký tự').optional().default(''),
    status: z.enum(['ALL', 'ACTIVE', 'INACTIVE', 'EXPIRED']).default('ALL'),
    minDiscountPercent: z
      .string()
      .trim()
      .optional()
      .default('')
      .refine((value) => value === '' || (Number(value) >= 0 && Number(value) <= 100), 'Phần trăm giảm giá không hợp lệ'),
    maxDiscountPercent: z
      .string()
      .trim()
      .optional()
      .default('')
      .refine((value) => value === '' || (Number(value) >= 0 && Number(value) <= 100), 'Phần trăm giảm giá không hợp lệ'),
    minDiscountAmount: z
      .string()
      .trim()
      .optional()
      .default('')
      .refine((value) => value === '' || Number(value) >= 0, 'Giá trị tối thiểu không hợp lệ'),
    maxDiscountAmount: z
      .string()
      .trim()
      .optional()
      .default('')
      .refine((value) => value === '' || Number(value) >= 0, 'Giá trị tối đa không hợp lệ'),
    minQuantity: z
      .string()
      .trim()
      .optional()
      .default('')
      .refine((value) => value === '' || Number(value) >= 0, 'Số lượng tối thiểu không hợp lệ'),
    maxQuantity: z
      .string()
      .trim()
      .optional()
      .default('')
      .refine((value) => value === '' || Number(value) >= 0, 'Số lượng tối đa không hợp lệ'),
  })
  .refine(
    (data) => {
      if (!data.minDiscountPercent || !data.maxDiscountPercent) return true
      return Number(data.minDiscountPercent) <= Number(data.maxDiscountPercent)
    },
    {
      path: ['maxDiscountPercent'],
      message: 'Phần trăm tối đa phải lớn hơn hoặc bằng phần trăm tối thiểu',
    },
  )
  .refine(
    (data) => {
      if (!data.minDiscountAmount || !data.maxDiscountAmount) return true
      return Number(data.minDiscountAmount) <= Number(data.maxDiscountAmount)
    },
    {
      path: ['maxDiscountAmount'],
      message: 'Số tiền tối đa phải lớn hơn hoặc bằng số tiền tối thiểu',
    },
  )
  .refine(
    (data) => {
      if (!data.minQuantity || !data.maxQuantity) return true
      return Number(data.minQuantity) <= Number(data.maxQuantity)
    },
    {
      path: ['maxQuantity'],
      message: 'Số lượng tối đa phải lớn hơn hoặc bằng số lượng tối thiểu',
    },
  )

export type VoucherFilterValues = z.infer<typeof voucherFilterSchema>

export const createVoucherSchema = z
  .object({
    code: z.string().trim().min(1, 'Mã voucher không được trống').max(50, 'Mã voucher không được quá 50 ký tự'),
    discountPercent: z
      .string()
      .trim()
      .optional()
      .default('')
      .refine((value) => value === '' || (Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 100), 'Phần trăm giảm giá phải từ 0 đến 100'),
    discountAmount: z
      .string()
      .trim()
      .optional()
      .default('')
      .refine((value) => value === '' || Number(value) >= 0, 'Số tiền giảm giá không được âm'),
    quantity: z.string().refine((value) => {
      const num = Number(value)
      return Number.isInteger(num) && num > 0
    }, 'Số lượng phải là số dương'),
    startDate: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
    endDate: z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
    status: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED']).default('ACTIVE'),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate)
      const end = new Date(data.endDate)
      return start < end
    },
    {
      path: ['endDate'],
      message: 'Ngày kết thúc phải sau ngày bắt đầu',
    },
  )
  .refine(
    (data) => {
      const percent = data.discountPercent?.trim()
      const amount = data.discountAmount?.trim()
      const percentNum = percent ? Number(percent) : 0
      const amountNum = amount ? Number(amount) : 0
      return percentNum > 0 || amountNum > 0
    },
    {
      path: ['discountPercent'],
      message: 'Phải có ít nhất một trong hai: phần trăm giảm hoặc số tiền giảm phải lớn hơn 0',
    },
  )

export type CreateVoucherFormValues = z.infer<typeof createVoucherSchema>

export function toNullableNumber(value: string | undefined): number | null {
  const normalized = value?.trim() ?? ''
  if (!normalized) return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}


import { z } from 'zod'

export const userFilterSchema = z.object({
  keyword: z.string().trim().max(120, 'Tu khoa khong duoc qua 120 ky tu').optional(),
  status: z.enum(['ALL', 'ACTIVE', 'INACTIVE']).default('ALL'),
  role: z.string().default('ALL'),
})

export type UserFilterValues = z.infer<typeof userFilterSchema>

export const createUserSchema = z.object({
  fullName: z.string().trim().min(2, 'Ho ten phai co it nhat 2 ky tu'),
  email: z.string().trim().email('Email khong hop le'),
  password: z.string().min(6, 'Mat khau it nhat 6 ky tu'),
  role_id: z.string().min(1, 'Vui long chon vai tro'),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>

export const updateUserSchema = z.object({
  fullName: z.string().trim().min(2, 'Ho ten phai co it nhat 2 ky tu'),
  email: z.string().trim().email('Email khong hop le'),
  // Edit mode allows empty password, but if provided it must be at least 6 chars.
  password: z.string().refine((value) => value.length === 0 || value.length >= 6, {
    message: 'Mat khau it nhat 6 ky tu',
  }),
  role_id: z.string().min(1, 'Vui long chon vai tro'),
})

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>

import { z } from 'zod'

export const tourSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Tên tour không được để trống'),
  location: z.string().min(1, 'Vị trí không được để trống'),
  image: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().optional(),
  duration: z.string().optional(),
  price: z.number().optional(),
  status: z.enum(['active', 'draft', 'upcoming'], {
    errorMap: () => ({ message: 'Trạng thái không hợp lệ' }),
  }),
  category: z.string().optional(),
  createdDate: z.string().optional(),
  updatedDate: z.string().optional(),
  capacity: z.number().optional(),
  description: z.string().optional(),
})

export const createTourSchema = tourSchema.omit({ id: true, createdDate: true, updatedDate: true })
export const updateTourSchema = tourSchema.partial()

export type Tour = z.infer<typeof tourSchema>
export type CreateTourInput = z.infer<typeof createTourSchema>
export type UpdateTourInput = z.infer<typeof updateTourSchema>

export const tourListFilterSchema = z.object({
  status: z.enum(['all', 'active', 'draft', 'upcoming']).optional().default('all'),
  searchTerm: z.string().optional(),
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).optional().default(10),
})

export type TourListFilter = z.infer<typeof tourListFilterSchema>

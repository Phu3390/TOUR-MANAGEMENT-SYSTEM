import { z } from 'zod'

export const roleFormSchema = z.object({
  name: z.string().trim().min(2, 'Ten vai tro phai co it nhat 2 ky tu'),
  role_permissions: z
    .array(
      z.object({
        permission_id: z.string().min(1, 'Permission ID is required'),
        action: z.enum(['create', 'update', 'delete', 'view']),
      }),
    )
    .default([]),
})

export type RoleFormValues = z.infer<typeof roleFormSchema>

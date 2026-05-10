export type StaticUserRole = 'ADMIN' | 'USER'

export type RoleOption = {
  value: StaticUserRole
  label: string
}

export const STATIC_USER_ROLE_OPTIONS: RoleOption[] = [
  { value: 'ADMIN', label: 'Quản trị viên' },
  { value: 'USER', label: 'Người dùng' },
]

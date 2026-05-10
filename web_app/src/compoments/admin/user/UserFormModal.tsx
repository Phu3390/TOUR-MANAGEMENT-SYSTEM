import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserSchema, type CreateUserFormValues, type UpdateUserFormValues, updateUserSchema } from '../../../schema/userSchema'
import { STATIC_USER_ROLE_OPTIONS } from '../../../utils/userRoles'

type UserFormModalProps = {
  open: boolean
  loading: boolean
  mode?: 'create' | 'edit'
  initialValues?: {
    fullName: string
    email: string
    role_id: string
  }
  onClose: () => void
  onSubmit: (values: CreateUserFormValues | UpdateUserFormValues) => void
}

const inputClass =
  'w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

export default function UserFormModal({
  open,
  loading,
  mode = 'create',
  initialValues,
  onClose,
  onSubmit,
}: UserFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues | UpdateUserFormValues>({
    resolver: zodResolver(mode === 'create' ? createUserSchema : updateUserSchema),
    defaultValues: {
      fullName: initialValues?.fullName || '',
      email: initialValues?.email || '',
      password: '',
      role_id: initialValues?.role_id || 'USER',
    },
  })

  useEffect(() => {
    if (!open) return

    reset({
      fullName: initialValues?.fullName || '',
      email: initialValues?.email || '',
      password: '',
      role_id: initialValues?.role_id || 'USER',
    })
  }, [open, reset, initialValues])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">{mode === 'create' ? 'Thêm người dùng mới' : 'Cập nhật người dùng'}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Họ và tên</label>
            <input {...register('fullName')} className={inputClass} placeholder="Nguyễn Văn A" />
            {errors.fullName && <p className="mt-1 text-xs text-rose-600">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Email</label>
            <input {...register('email')} className={inputClass} placeholder="example@travel.vn" />
            {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              {mode === 'create' ? 'Mật khẩu' : 'Mật khẩu mới (không bắt buộc)'}
            </label>
            <input
              type="password"
              {...register('password')}
              className={inputClass}
              placeholder={mode === 'create' ? 'Tối thiểu 6 ký tự' : 'Để trống nếu không đổi'}
            />
            {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Vai trò</label>
            <select {...register('role_id')} className={inputClass}>
              {STATIC_USER_ROLE_OPTIONS.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {errors.role_id && <p className="mt-1 text-xs text-rose-600">{errors.role_id.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
                Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Đang xử lý...' : mode === 'create' ? 'Lưu' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

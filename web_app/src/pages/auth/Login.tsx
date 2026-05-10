import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch } from '../../store/hooks'
import { login } from '../../store/auth/slice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { loginSchema, type LoginFormValues } from '../../schema/authSchema'

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values: LoginFormValues) => {
    const res: any = await dispatch(login(values))
    if (res.error) {
      const msg = res.payload?.message || res.error.message || 'Đăng nhập thất bại'
      toast.error(msg)
      return
    }
    toast.success('Đăng nhập thành công')
    navigate('/admin')
  }

  const inputClass =
    'w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100'

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#667eea] to-[#764ba2] px-5 py-6">
      <div className="w-full max-w-120 rounded-2xl bg-white px-6 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.15)] sm:px-12">
        <div className="mb-8 text-center">
          <h1 className="mb-2 flex items-center justify-center gap-2 text-4xl font-bold text-[#0066cc]">
            <span className="text-2xl">⊙</span>
            TourTravel
          </h1>
          <h2 className="mt-4 text-4xl font-bold text-[#1a1a1a]">Đăng nhập</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="email" className="text-sm font-medium text-[#333]">Email</label>
            </div>
            <input
              id="email"
              type="email"
              placeholder="example@travel.com"
              {...register('email')}
              className={`${inputClass} ${
                errors.email
                  ? 'border-[#e63946] bg-[rgba(230,57,70,0.05)]'
                  : 'border-[#ddd]'
              }`}
            />
            {errors.email && <p className="mt-1.5 text-xs text-[#e63946]">{errors.email.message}</p>}
          </div>

          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-[#333]">Mật khẩu</label>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`${inputClass} ${
                errors.password
                  ? 'border-[#e63946] bg-[rgba(230,57,70,0.05)]'
                  : 'border-[#ddd]'
              }`}
            />
            {errors.password && <p className="mt-1.5 text-xs text-[#e63946]">{errors.password.message}</p>}
          </div>

          <div className="-mt-1 mb-4 flex justify-end">
            <a href="/forgot" className="text-[13px] text-[#0066cc] transition-colors hover:text-[#0052a3]">
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            className="mb-5 w-full rounded-lg bg-linear-to-br from-[#0066cc] to-[#0052a3] px-4 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,102,204,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="relative my-6 px-4 text-center text-xs text-[#999] before:absolute before:left-0 before:top-1/2 before:h-px before:w-[calc(50%-40px)] before:bg-[#ddd] before:content-[''] after:absolute after:right-0 after:top-1/2 after:h-px after:w-[calc(50%-40px)] after:bg-[#ddd] after:content-['']">
          HOẶC TIẾP TỤC VỚI
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg border border-[#ddd] bg-white px-4 py-3 text-sm font-medium text-[#666] transition hover:border-[#bbb] hover:bg-[#f9f9f9]"
          >
            <span className="text-base font-bold">G</span> Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg border border-[#ddd] bg-white px-4 py-3 text-sm font-medium text-[#666] transition hover:border-[#bbb] hover:bg-[#f9f9f9]"
          >
            <span className="text-base font-bold">f</span> Facebook
          </button>
        </div>

        <div className="text-center text-[13px] text-[#666]">
          <p>
            Chưa có tài khoản?{' '}
            <a href="/signup" className="text-[#0066cc] transition-colors hover:text-[#0052a3] hover:underline">
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

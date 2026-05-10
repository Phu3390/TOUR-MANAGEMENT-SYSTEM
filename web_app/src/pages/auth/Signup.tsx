import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch } from '../../store/hooks'
import { signup } from '../../store/auth/slice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { signupSchema, type SignupFormValues } from '../../schema/authSchema'

export default function Signup() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) })

  const onSubmit = async (values: SignupFormValues) => {
    const payload = {
      fullName: values.fullName,
      email: values.email,
      phone: values.phone || undefined,
      password: values.password,
    }
    const res: any = await dispatch(signup(payload))
    if (res.error) {
      const msg = res.payload?.message || res.error.message || 'Đăng ký thất bại'
      toast.error(msg)
      return
    }
    toast.success('Đăng ký thành công')
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
          <h2 className="mt-4 text-4xl font-bold text-[#1a1a1a]">Đăng ký tài khoản</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mb-6 text-left">
          <div className="mb-5">
            <label htmlFor="fullName" className="mb-2 block text-left text-sm font-medium text-[#333]">Họ và tên</label>
            <input
              id="fullName"
              type="text"
              placeholder="Nguyễn Văn A"
              {...register('fullName')}
              className={`${inputClass} ${
                errors.fullName
                  ? 'border-[#e63946] bg-[rgba(230,57,70,0.05)]'
                  : 'border-[#ddd]'
              }`}
            />
            {errors.fullName && <p className="mt-1.5 text-xs text-[#e63946]">{errors.fullName.message}</p>}
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="mb-2 block text-left text-sm font-medium text-[#333]">Email</label>
            <input
              id="email"
              type="email"
              placeholder="email@travel.com"
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
            <label htmlFor="password" className="mb-2 block text-left text-sm font-medium text-[#333]">Mật khẩu</label>
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

          <div className="mb-5">
            <label htmlFor="confirmPassword" className="mb-2 block text-left text-sm font-medium text-[#333]">Xác nhận mật khẩu</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              className={`${inputClass} ${
                errors.confirmPassword
                  ? 'border-[#e63946] bg-[rgba(230,57,70,0.05)]'
                  : 'border-[#ddd]'
              }`}
            />
            {errors.confirmPassword && <p className="mt-1.5 text-xs text-[#e63946]">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            className="mb-5 w-full rounded-lg bg-linear-to-br from-[#0066cc] to-[#0052a3] px-4 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,102,204,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đăng ký ngay'}
          </button>
        </form>

         <div className="text-center text-[13px] text-[#666]">
          <p>
           Bạn đã có tài khoản?{' '}
            <a href="/login" className="text-[#0066cc] transition-colors hover:text-[#0052a3] hover:underline">
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

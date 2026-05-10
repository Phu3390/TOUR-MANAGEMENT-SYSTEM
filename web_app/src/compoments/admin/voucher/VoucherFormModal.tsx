import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createVoucherSchema, type CreateVoucherFormValues } from '../../../schema/voucherSchema'
import type { VoucherResponse } from '../../../types/booking/voucher.type'

type VoucherFormModalProps = {
  open: boolean
  loading: boolean
  mode?: 'create' | 'edit'
  initialValues?: {
    code: string
    discountPercent: number | null
    discountAmount: number | null
    quantity: number
    startDate: string
    endDate: string
    status: 'ACTIVE' | 'INACTIVE'
  }
  onClose: () => void
  onSubmit: (values: CreateVoucherFormValues) => void
}

const inputClass =
  'w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

function formatDateForInput(date: string | Date): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function VoucherFormModal({
  open,
  loading,
  mode = 'create',
  initialValues,
  onClose,
  onSubmit,
}: VoucherFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateVoucherFormValues>({
    resolver: zodResolver(createVoucherSchema),
    defaultValues: {
      code: '',
      discountPercent: '',
      discountAmount: '',
      quantity: '1',
      startDate: '',
      endDate: '',
      status: 'ACTIVE',
    },
  })

  useEffect(() => {
    if (!open) return

    if (mode === 'create') {
      reset({
        code: '',
        discountPercent: '',
        discountAmount: '',
        quantity: '1',
        startDate: '',
        endDate: '',
        status: 'ACTIVE',
      })
    } else if (mode === 'edit' && initialValues) {
      reset({
        code: initialValues.code,
        discountPercent: initialValues.discountPercent?.toString() || '',
        discountAmount: initialValues.discountAmount?.toString() || '',
        quantity: initialValues.quantity.toString(),
        startDate: formatDateForInput(initialValues.startDate),
        endDate: formatDateForInput(initialValues.endDate),
        status: initialValues.status || 'ACTIVE',
      })
    }
  }, [open, reset, mode, initialValues])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 overflow-y-auto" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl my-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">
            {mode === 'create' ? 'Tạo voucher mới' : 'Cập nhật voucher'}
          </h3>
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
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mã voucher</label>
              <input 
                {...register('code')} 
                className={inputClass} 
                placeholder="VOU2024..." 
                disabled={mode === 'edit'}
              />
              {errors.code && <p className="mt-1 text-xs text-rose-600">{errors.code.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái</label>
              <select {...register('status')} className={inputClass}>
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Không hoạt động</option>
              </select>
              {errors.status && <p className="mt-1 text-xs text-rose-600">{errors.status.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Phần trăm giảm (%)</label>
              <input {...register('discountPercent')} type="number" min="0" max="100" className={inputClass} placeholder="0" />
              {errors.discountPercent && <p className="mt-1 text-xs text-rose-600">{errors.discountPercent.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Số tiền giảm (đ)</label>
              <input {...register('discountAmount')} type="number" min="0" className={inputClass} placeholder="0" />
              {errors.discountAmount && <p className="mt-1 text-xs text-rose-600">{errors.discountAmount.message}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Số lượng</label>
            <input {...register('quantity')} type="number" min="1" className={inputClass} placeholder="1" />
            {errors.quantity && <p className="mt-1 text-xs text-rose-600">{errors.quantity.message}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ngày bắt đầu</label>
              <input {...register('startDate')} type="date" className={inputClass} />
              {errors.startDate && <p className="mt-1 text-xs text-rose-600">{errors.startDate.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ngày kết thúc</label>
              <input {...register('endDate')} type="date" className={inputClass} />
              {errors.endDate && <p className="mt-1 text-xs text-rose-600">{errors.endDate.message}</p>}
            </div>
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
              {loading ? 'Đang xử lý...' : mode === 'create' ? 'Tạo voucher' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

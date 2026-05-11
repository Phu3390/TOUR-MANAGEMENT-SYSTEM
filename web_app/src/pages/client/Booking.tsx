import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getById } from '../../api/tour/tour.api'
import { createBooking, getById as getBookingById } from '../../api/booking/booking.api'
import { getVoucherByCode } from '../../api/booking/voucher.api'
import { createPostBookingPayment } from '../../utils/bookingPayment'
import { buildCreateBookingSchema, type CreateBookingInput } from '../../schema/bookingSchema'
import type { TourResponse } from '../../types/tour/tour.type'
import { TourDetailStatus } from '../../types/enums/TourDetailStatus.enum'
import { BookingStatus } from '../../types/enums/BookingStatus.enum'
import { PaymentMethod } from '../../types/enums/PaymentMethod.enum'
import { PaymentStatus } from '../../types/enums/PaymentStatus.enum'
import { PriceType } from '../../types/enums/PriceType.enum'
import { Status } from '../../types/enums/Status.enum'

const formatVnd = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(value)

const formatDateVi = (value: string | Date) => {
  const date = new Date(value)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const formatTimeVi = (value: string | Date) => {
  const date = new Date(value)
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const travelerOptions = [
  { priceType: PriceType.ADULT, label: 'Người lớn' },
  { priceType: PriceType.CHILD, label: 'Trẻ em' },
] as const

export default function BookingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tour, setTour] = useState<TourResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDetailIndex, setSelectedDetailIndex] = useState(0)
  const [voucherCode, setVoucherCode] = useState('')
  const [voucherDiscount, setVoucherDiscount] = useState(0)
  const [appliedVoucherCode, setAppliedVoucherCode] = useState<string | null>(null)
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchTour = async () => {
      if (!id) {
        setError('Tour không tìm thấy')
        setLoading(false)
        return
      }
      try {
        const response = await getById(id)
        if (response.code === 200 && response.data) {
          setTour(response.data)
        } else {
          setError(response.message || 'Lỗi khi tải tour')
        }
      } catch {
        setError('Lỗi khi tải tour')
      } finally {
        setLoading(false)
      }
    }
    fetchTour()
  }, [id])

  const sortedDetails = useMemo(
    () =>
      tour?.tourDetails
        ?.filter((detail) => detail.status === TourDetailStatus.ACTIVE)
        .sort((a, b) => new Date(a.startDay).getTime() - new Date(b.startDay).getTime()) || [],
    [tour],
  )

  const selectedDetail = sortedDetails[selectedDetailIndex]

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<CreateBookingInput>({
    resolver: zodResolver(
      buildCreateBookingSchema({
        remainingSeats: selectedDetail?.remainingSeats,
        allowChild: selectedDetail?.tourPrices?.some((p) => p.priceType === PriceType.CHILD) ?? false,
      }),
    ),
    defaultValues: {
      status: BookingStatus.PENDING,
      bookingItems: [
        { priceType: PriceType.ADULT, quantity: 1, unitPrice: 0 },
        { priceType: PriceType.CHILD, quantity: 0, unitPrice: 0 },
      ],
      paymentRequests: [
        {
          amount: 0,
          method: PaymentMethod.CASH,
          status: PaymentStatus.PENDING,
          transactionCode: 'TXN-PENDING',
          provider: 'Manual',
        },
      ],
    },
  })

  const bookingItems = useWatch({ control, name: 'bookingItems' })
  const contactFullname = useWatch({ control, name: 'contactFullname' })
  const contactEmail = useWatch({ control, name: 'contactEmail' })
  const contactPhone = useWatch({ control, name: 'contactPhone' })
  const contactAddress = useWatch({ control, name: 'contactAddress' })
  const selectedPaymentMethod = useWatch({ control, name: 'paymentRequests.0.method' })

  const hasChildPrice = useMemo(
    () => selectedDetail?.tourPrices?.some((p) => p.priceType === PriceType.CHILD) ?? false,
    [selectedDetail],
  )

  const availableTravelerOptions = useMemo(
    () =>
      hasChildPrice
        ? travelerOptions
        : travelerOptions.filter((option) => option.priceType !== PriceType.CHILD),
    [hasChildPrice],
  )

  const getBookingItemIndexByPriceType = (priceType: PriceType) =>
    travelerOptions.findIndex((option) => option.priceType === priceType)

  useEffect(() => {
    if (!hasChildPrice) {
      const childIndex = getBookingItemIndexByPriceType(PriceType.CHILD)
      if (childIndex >= 0) {
        setValue(`bookingItems.${childIndex}.quantity`, 0)
      }
    }
  }, [hasChildPrice, setValue])

  const selectedPrices = useMemo(() => {
    const adultPrice = selectedDetail?.tourPrices?.find((p) => p.priceType === PriceType.ADULT)?.price || 0
    const childPrice = selectedDetail?.tourPrices?.find((p) => p.priceType === PriceType.CHILD)?.price || 0

    return { adultPrice, childPrice }
  }, [selectedDetail])

  const derivedBookingItems = useMemo(
    () =>
      availableTravelerOptions.map((option) => {
        const formIndex = getBookingItemIndexByPriceType(option.priceType)
        const quantity = Number(bookingItems?.[formIndex]?.quantity || 0)
        const unitPrice = option.priceType === PriceType.CHILD ? selectedPrices.childPrice : selectedPrices.adultPrice

        return {
          priceType: option.priceType,
          unitPrice,
          quantity,
          total: unitPrice * quantity,
        }
      }),
    [availableTravelerOptions, bookingItems, selectedPrices.adultPrice, selectedPrices.childPrice],
  )

  const totalPrice = derivedBookingItems.reduce((sum, item) => sum + item.total, 0)
  const totalTravelers = derivedBookingItems.reduce((sum, item) => sum + item.quantity, 0)
  const remainingSeats = selectedDetail?.remainingSeats ?? 0
  const finalTotal = Math.max(totalPrice - voucherDiscount, 0)

  const calculateVoucherDiscount = (
    baseAmount: number,
    voucher: {
      discountPercent: number | null
      discountAmount: number | null
    },
  ) => {
    if (voucher.discountPercent != null && voucher.discountPercent > 0) {
      return Math.floor((baseAmount * voucher.discountPercent) / 100)
    }

    if (voucher.discountAmount != null && voucher.discountAmount > 0) {
      return Math.floor(voucher.discountAmount)
    }

    return 0
  }

  const handleApplyVoucher = async () => {
    const code = voucherCode.trim().toUpperCase()

    if (!code) {
      toast.error('Vui lòng nhập mã voucher')
      return
    }

    if (totalPrice <= 0) {
      toast.error('Tổng tiền phải lớn hơn 0 để áp dụng voucher')
      return
    }

    try {
      setIsApplyingVoucher(true)
      const response = await getVoucherByCode(code)

      if (response.code !== 200 || !response.data) {
        setVoucherDiscount(0)
        setAppliedVoucherCode(null)
        toast.error(response.message || 'Mã voucher không tồn tại')
        return
      }

      const voucher = response.data
      const now = new Date()
      const startDate = new Date(voucher.startDate)
      const endDate = new Date(voucher.endDate)

      if (voucher.status !== Status.ACTIVE) {
        setVoucherDiscount(0)
        setAppliedVoucherCode(null)
        toast.error('Voucher chưa được kích hoạt hoặc đã tắt')
        return
      }

      if (voucher.quantity <= 0) {
        setVoucherDiscount(0)
        setAppliedVoucherCode(null)
        toast.error('Voucher đã hết lượt sử dụng')
        return
      }

      if (now < startDate || now > endDate) {
        setVoucherDiscount(0)
        setAppliedVoucherCode(null)
        toast.error('Voucher đã hết hạn hoặc chưa đến thời gian áp dụng')
        return
      }

      const discount = calculateVoucherDiscount(totalPrice, {
        discountPercent: voucher.discountPercent,
        discountAmount: voucher.discountAmount,
      })

      if (discount <= 0) {
        setVoucherDiscount(0)
        setAppliedVoucherCode(null)
        toast.error('Voucher không hợp lệ')
        return
      }

      setVoucherDiscount(Math.min(discount, totalPrice))
      setVoucherCode(code)
      setAppliedVoucherCode(code)
      toast.success('Áp dụng voucher thành công')
    } catch {
      setVoucherDiscount(0)
      setAppliedVoucherCode(null)
      toast.error('Mã voucher không tồn tại hoặc không thể kiểm tra lúc này')
    } finally {
      setIsApplyingVoucher(false)
    }
  }

  const onSubmit = async (data: CreateBookingInput) => {
    if (!selectedDetail) {
      toast.error('Vui lòng chọn đợt khởi hành')
      return
    }

    const childInput = data.bookingItems.find((item) => item.priceType === PriceType.CHILD)
    if (!hasChildPrice && (childInput?.quantity ?? 0) > 0) {
      toast.error('Đợt tour này không áp dụng vé trẻ em')
      return
    }

    try {
      setIsSubmitting(true)
      const payload = {
        bookingRequest: {
          tourId: tour!.id,
          tourDetailId: selectedDetail.id,
          contactFullname: data.contactFullname,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          contactAddress: data.contactAddress,
          totalPrice: finalTotal,
          status: data.status,
          note: data.note,
        },
        bookingItems: derivedBookingItems
          .filter((item) => item.quantity > 0)
          .map((item) => ({
            priceType: item.priceType as PriceType,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        paymentRequests: data.paymentRequests.map((payment) => ({
          amount: finalTotal,
          method: payment.method,
          status: payment.status,
          transactionCode: payment.transactionCode,
          provider: payment.provider,
          paidAt: payment.paidAt,
        })),
        code: appliedVoucherCode || undefined,
      }

      const response = await createBooking(payload)
      const booking = response.data

      if (response.code === 201 || response.code === 200) {
        if (!booking) {
          toast.error('Không nhận được thông tin booking sau khi tạo thành công')
          return
        }

        const paymentMethod = data.paymentRequests[0]?.method ?? PaymentMethod.CASH

        if (paymentMethod === PaymentMethod.VNPAY) {
          const bookingDetailResponse = await getBookingById(booking.id)
          const bookingForPayment = bookingDetailResponse?.data ?? booking
          const paymentResponse = await createPostBookingPayment(bookingForPayment, paymentMethod)

          if (paymentResponse?.code === 200 && paymentResponse.data?.url) {
            toast.info('Đang chuyển sang cổng thanh toán VNPAY...')
            window.location.assign(paymentResponse.data.url)
            return
          }

          toast.error(paymentResponse?.message || 'Không tạo được liên kết thanh toán VNPAY')
          setCurrentStep(4)
          reset()
          return
        }

        if (paymentMethod === PaymentMethod.MOMO) {
          const bookingDetailResponse = await getBookingById(booking.id)
          const bookingForPayment = bookingDetailResponse?.data ?? booking
          const paymentResponse = await createPostBookingPayment(bookingForPayment, paymentMethod)

          if (paymentResponse?.code === 200 && paymentResponse.data?.url) {
            toast.info('Đang chuyển sang cổng thanh toán MOMO...')
            window.location.assign(paymentResponse.data.url)
            return
          }

          toast.error(paymentResponse?.message || 'Không tạo được liên kết thanh toán MOMO')
          setCurrentStep(4)
          reset()
          return
        }

        toast.success('Đặt tour thành công! Chúng tôi sẽ liên hệ bạn sớm.')
        reset()
        setCurrentStep(4)
      } else {
        toast.error(response.message || 'Đặt tour thất bại')
      }
    } catch {
      const message = 'Có lỗi xảy ra khi đặt tour'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasValidTravelerCount = totalTravelers > 0 && totalTravelers <= remainingSeats
  const isStep2Valid =
    contactFullname &&
    contactEmail &&
    contactPhone &&
    contactAddress &&
    contactAddress.trim().length >= 5 &&
    selectedDetail &&
    hasValidTravelerCount
  const isStep3Valid = selectedPaymentMethod

  const handleNextStep = () => {
    if (currentStep === 2 && !isStep2Valid) {
      if (!contactFullname) {
        toast.error('Vui lòng nhập họ và tên')
        return
      }
      if (!contactEmail) {
        toast.error('Vui lòng nhập email')
        return
      }
      if (!contactPhone) {
        toast.error('Vui lòng nhập số điện thoại')
        return
      }
      if (contactPhone.length < 9 || contactPhone.length > 11) {
        toast.error('Số điện thoại phải từ 9 đến 11 ký tự')
        return
      }
      if (!contactAddress) {
        toast.error('Vui lòng nhập địa chỉ')
        return
      }
      if (contactAddress.trim().length < 5) {
        toast.error('Địa chỉ phải ≥ 5 ký tự')
        return
      }
      if (totalTravelers <= 0) {
        toast.error('Vui lòng chọn ít nhất 1 khách')
        return
      }
      if (totalTravelers > remainingSeats) {
        toast.error(`Số khách vượt quá số chỗ còn lại (${remainingSeats})`)
        return
      }
      if (!selectedDetail) {
        toast.error('Vui lòng chọn đợt khởi hành')
        return
      }
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">Đang tải...</p>
      </div>
    )
  }

  if (error || !tour) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <p className="mb-4 text-slate-900">{error || 'Tour không tìm thấy'}</p>
          <Link to="/client/tours" className="text-blue-600 hover:text-blue-700">
            ← Quay lại danh sách tour
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <Link to={`/client/tours/${id}`} className="mb-6 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700">
          ← Quay lại tour
        </Link>

        {/* Step Indicator */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: 'Chọn Tour' },
              { step: 2, label: 'Thông Tin' },
              { step: 3, label: 'Thanh Toán' },
              { step: 4, label: 'Hoàn Thành' },
            ].map((item, idx, arr) => (
              <div key={item.step} className="flex items-center flex-1">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-white ${
                    item.step < currentStep
                      ? 'bg-emerald-500'
                      : item.step === currentStep
                        ? 'bg-blue-600'
                        : 'bg-slate-300'
                  }`}
                >
                  {item.step < currentStep ? '✓' : item.step}
                </div>
                <span
                  className={`ml-2 text-sm font-semibold ${
                    item.step <= currentStep ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
                {idx < arr.length - 1 && (
                  <div className={`mx-2 h-1 flex-1 ${item.step < currentStep ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Select Tour */}
              {currentStep === 1 && (
                <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900">Chọn Tour</h2>
                  <div className="rounded-lg border-2 border-blue-600 bg-blue-50 p-4">
                    <p className="text-lg font-bold text-slate-900">{tour.title}</p>
                    <p className="mt-1 text-sm text-slate-600">📍 {tour.location}</p>
                    <p className="mt-1 text-sm text-slate-600">⏱️ {tour.duration}</p>
                    <p className="mt-2 text-sm text-slate-600">{tour.shortDesc}</p>
                  </div>
                </div>
              )}

              {/* Step 2: Customer Information & Departure */}
              {currentStep === 2 && (
                <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
                  <div>
                    <h2 className="mb-4 text-2xl font-bold text-slate-900">👤 Thông Tin Khách Hàng</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Họ tên *</label>
                        <input
                          type="text"
                          {...register('contactFullname')}
                          placeholder="Nguyễn Văn A"
                          className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                        {errors.contactFullname && (
                          <p className="mt-1 text-xs text-rose-600">{errors.contactFullname.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Số điện thoại *</label>
                        <input
                          type="tel"
                          {...register('contactPhone')}
                          placeholder="0987654321"
                          className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                        {errors.contactPhone && (
                          <p className="mt-1 text-xs text-rose-600">{errors.contactPhone.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Email *</label>
                        <input
                          type="email"
                          {...register('contactEmail')}
                          placeholder="email@example.com"
                          className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                        {errors.contactEmail && (
                          <p className="mt-1 text-xs text-rose-600">{errors.contactEmail.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Địa chỉ *</label>
                        <input
                          type="text"
                          {...register('contactAddress')}
                          placeholder="123 Đường XYZ, Hà Nội"
                          className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                        {errors.contactAddress && (
                          <p className="mt-1 text-xs text-rose-600">{errors.contactAddress.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">Yêu cầu đặc biệt (tùy chọn)</label>
                      <textarea
                        {...register('note')}
                        placeholder="Nhập yêu cầu khác..."
                        rows={3}
                        className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-xl font-bold text-slate-900">📅 Chọn Đợt Khởi Hành</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      {sortedDetails.map((detail, idx) => (
                        <button
                          key={detail.id}
                          type="button"
                          onClick={() => setSelectedDetailIndex(idx)}
                          className={`rounded-lg border-2 p-4 text-left transition ${
                            selectedDetailIndex === idx
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <p className="font-bold text-slate-900">{formatDateVi(detail.startDay)}</p>
                          <p className="text-xs text-slate-600">
                            Khởi hành lúc {formatTimeVi(detail.startDay)}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-emerald-600">
                            {detail.remainingSeats > 0
                              ? `Còn ${detail.remainingSeats} chỗ`
                              : 'Hết chỗ'}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Travelers Selection */}
                  <div>
                    <h3 className="mb-4 text-xl font-bold text-slate-900">👥 Lựa Chọn Khách</h3>

                    {!hasChildPrice && (
                      <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                        Đợt khởi hành này không áp dụng vé trẻ em.
                      </p>
                    )}

                    <div className="space-y-3">
                      {availableTravelerOptions.map((option) => {
                        const idx = getBookingItemIndexByPriceType(option.priceType)
                        const derived = derivedBookingItems.find((item) => item.priceType === option.priceType)

                        return (
                          <div key={option.priceType} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-700">
                                  {option.priceType === PriceType.ADULT ? '👨 ' : '👧 '}
                                  {option.label}
                                </p>
                                <p className="text-xs text-slate-500">{formatVnd(derived?.unitPrice || 0)}/người</p>
                              </div>

                              <div className="flex items-center gap-2">
                                <label className="text-xs font-semibold text-slate-700">Số lượng</label>
                                <input
                                  type="number"
                                  min="0"
                                  {...register(`bookingItems.${idx}.quantity` as const, { valueAsNumber: true })}
                                  className="w-20 rounded border border-slate-200 px-3 py-2 text-sm text-center"
                                />
                              </div>

                              <span className="min-w-40 text-right font-bold text-blue-600">
                                {formatVnd(derived?.total || 0)}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {errors.bookingItems && <p className="mt-2 text-xs text-rose-600">{errors.bookingItems.message}</p>}
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method */}
              {currentStep === 3 && (
                <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900">💳 Phương Thức Thanh Toán</h2>

                  {/* Payment Options */}
                  <div className="space-y-3">
                    {[
                      { value: PaymentMethod.MOMO, label: '📱 MOMO', desc: 'Ví điện tử Momo' },
                      { value: PaymentMethod.VNPAY, label: '🏦 VNPay', desc: 'Cổng thanh toán VNPay' },
                      { value: PaymentMethod.CASH, label: '💵 Thanh toán khi tới', desc: 'Trả tiền mặt' },
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition ${
                          selectedPaymentMethod === method.value
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          {...register('paymentRequests.0.method')}
                          value={method.value}
                          className="h-5 w-5"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{method.label}</p>
                          <p className="text-xs text-slate-600">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Voucher Code */}
                  <div>
                    <h3 className="mb-3 text-lg font-bold text-slate-900">🎟️ Mã Voucher (tùy chọn)</h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => {
                          setVoucherCode(e.target.value.toUpperCase())
                          if (appliedVoucherCode && e.target.value.toUpperCase() !== appliedVoucherCode) {
                            setAppliedVoucherCode(null)
                            setVoucherDiscount(0)
                          }
                        }}
                        placeholder="Nhập mã voucher"
                        className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleApplyVoucher}
                        disabled={isApplyingVoucher}
                        className="rounded-lg bg-emerald-600 px-6 py-2 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isApplyingVoucher ? 'Đang kiểm tra...' : 'Áp Dụng'}
                      </button>
                    </div>
                    {voucherDiscount > 0 && (
                      <p className="mt-2 text-sm font-semibold text-emerald-600">✓ Mã {appliedVoucherCode}: giảm {formatVnd(voucherDiscount)}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div className="space-y-6 rounded-lg bg-white p-6 text-center shadow-sm">
                  <div className="flex justify-center">
                    <div className="text-6xl">✅</div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Đặt Tour Thành Công!</h2>
                    <p className="mt-2 text-slate-600">Chúng tôi sẽ liên hệ bạn qua email {contactEmail} để xác nhận chi tiết</p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex gap-3">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 rounded-lg border-2 border-slate-200 py-3 font-bold text-slate-700 hover:bg-slate-50"
                    >
                      ← Quay Lại
                    </button>
                  )}
                  {currentStep === 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-700"
                    >
                      Tiếp Tục →
                    </button>
                  )}
                  {currentStep === 2 && (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={!isStep2Valid}
                      className="flex-1 rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      Tiếp Tục →
                    </button>
                  )}                  {currentStep === 3 && (
                    <button
                      type="submit"
                      disabled={isSubmitting || !isStep3Valid}
                      className="flex-1 rounded-lg bg-orange-600 py-3 font-bold text-white hover:bg-orange-700 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Đang xử lý...' : 'Hoàn Thành Đặt Tour'}
                    </button>
                  )}
                </div>
              )}

              {currentStep === 4 && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/client/tours')}
                    className="flex-1 rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-700"
                  >
                    ← Quay Về Danh Sách Tour
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Summary */}
          <div>
            <div className="sticky top-20 space-y-4 rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">📋 Tóm Tắt</h3>

              {/* Tour Image */}
              <div className="aspect-video overflow-hidden rounded-lg">
                <img src={tour.gallery?.[0] || tour.imageUrl} alt={tour.title} className="h-full w-full object-cover" />
              </div>

              {/* Tour Info */}
              <div>
                <p className="font-bold text-slate-900">{tour.title}</p>
                <p className="text-xs text-slate-600">
                  {selectedDetail ? formatDateVi(selectedDetail.startDay) : 'Chọn ngày'} • {tour.duration}
                </p>
              </div>

              {/* Travelers */}
              {derivedBookingItems.length > 0 && (
                <div className="space-y-2 border-t border-slate-200 pt-4">
                  <h4 className="font-semibold text-slate-900">Khách</h4>
                  {derivedBookingItems.map((item, idx) => (
                    <div key={`${item.priceType}-${idx}`} className="flex justify-between text-xs">
                      <span className="text-slate-600">
                        {item.priceType === PriceType.ADULT ? '👨 Người lớn' : '👧 Trẻ em'} ({item.quantity}x)
                      </span>
                      <span className="font-semibold text-slate-900">{formatVnd(item.total)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Voucher Code */}
              <div className="space-y-2 border-t border-slate-200 pt-4">
                <h4 className="font-semibold text-slate-900">🎟️ Mã Voucher</h4>
                <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {voucherCode ? voucherCode : 'Chưa nhập mã voucher'}
                </div>
                {voucherDiscount > 0 && (
                  <p className="text-xs font-semibold text-emerald-600">Đã giảm {formatVnd(voucherDiscount)}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 border-t border-slate-200 pt-4">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Cộng tiền</span>
                  <span className="font-semibold text-slate-900">{formatVnd(totalPrice)}</span>
                </div>
                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600">
                    <span>🎟️ Giảm giá</span>
                    <span className="font-semibold">-{formatVnd(voucherDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-200 pt-2 text-lg font-bold text-blue-600">
                  <span>Tổng Cộng</span>
                  <span>{formatVnd(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

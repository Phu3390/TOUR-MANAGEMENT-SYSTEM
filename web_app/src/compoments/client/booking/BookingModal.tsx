import { useState } from 'react'
import { toast } from 'react-toastify'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createBooking, getById as getBookingById } from '../../../api/booking/booking.api'
import { createPostBookingPayment } from '../../../utils/bookingPayment'
import { buildCreateBookingSchema, type CreateBookingInput } from '../../../schema/bookingSchema'
import type { TourResponse } from '../../../types/tour/tour.type'
import { TourDetailStatus } from '../../../types/enums/TourDetailStatus.enum'
import { BookingStatus } from '../../../types/enums/BookingStatus.enum'
import { PaymentMethod } from '../../../types/enums/PaymentMethod.enum'
import { PaymentStatus } from '../../../types/enums/PaymentStatus.enum'
import { PriceType } from '../../../types/enums/PriceType.enum'

interface BookingModalProps {
  tour: TourResponse
  isOpen: boolean
  onClose: () => void
}

const formatVnd = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(value)

const formatDate = (value: string | Date) => {
  const date = new Date(value)
  const day = date.getDate()
  const month = date.toLocaleString('en-US', { month: 'short' })
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}

const travelerOptions = [
  { priceType: PriceType.ADULT, label: 'Người lớn' },
  { priceType: PriceType.CHILD, label: 'Trẻ em' },
] as const

export default function BookingModal({ tour, isOpen, onClose }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDetailIndex, setSelectedDetailIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sortedDetails = tour.tourDetails
    ?.filter((detail) => detail.status === TourDetailStatus.ACTIVE)
    .sort((a, b) => new Date(a.startDay).getTime() - new Date(b.startDay).getTime()) || []

  const selectedDetail = sortedDetails[selectedDetailIndex]
  const hasChildPrice = selectedDetail?.tourPrices?.some((p) => p.priceType === PriceType.CHILD) ?? false
  const remainingSeats = selectedDetail?.remainingSeats ?? 0

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateBookingInput>({
    resolver: zodResolver(
      buildCreateBookingSchema({
        remainingSeats,
        allowChild: hasChildPrice,
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

  const bookingItems = useWatch({ control, name: 'bookingItems' }) || []
  const contactFullname = useWatch({ control, name: 'contactFullname' })
  const contactEmail = useWatch({ control, name: 'contactEmail' })
  const contactPhone = useWatch({ control, name: 'contactPhone' })
  const contactAddress = useWatch({ control, name: 'contactAddress' })
  const selectedPaymentMethod = useWatch({ control, name: 'paymentRequests.0.method' })

  const availableTravelerOptions = hasChildPrice
    ? travelerOptions
    : travelerOptions.filter((option) => option.priceType !== PriceType.CHILD)

  const getBookingItemIndexByPriceType = (priceType: PriceType) =>
    travelerOptions.findIndex((option) => option.priceType === priceType)

  const selectedPrices = {
    adultPrice: selectedDetail?.tourPrices?.find((p) => p.priceType === PriceType.ADULT)?.price || 0,
    childPrice: selectedDetail?.tourPrices?.find((p) => p.priceType === PriceType.CHILD)?.price || 0,
  }

  const derivedBookingItems = availableTravelerOptions.map((option) => {
    const idx = getBookingItemIndexByPriceType(option.priceType)
    const quantity = Number(bookingItems?.[idx]?.quantity || 0)
    const unitPrice = option.priceType === PriceType.CHILD ? selectedPrices.childPrice : selectedPrices.adultPrice

    return {
      priceType: option.priceType,
      unitPrice,
      quantity,
      total: unitPrice * quantity,
    }
  })

  const totalPrice = derivedBookingItems.reduce((sum, item) => sum + item.total, 0)
  const totalTravelers = derivedBookingItems.reduce((sum, item) => sum + item.quantity, 0)
  const finalTotal = totalPrice

  const onSubmit = async (data: CreateBookingInput) => {
    if (!selectedDetail) {
      toast.error('Vui lòng chọn đợt khởi hành')
      return
    }

    if (totalTravelers <= 0) {
      toast.error('Phải chọn ít nhất 1 khách')
      return
    }

    if (totalTravelers > remainingSeats) {
      toast.error(`Số khách vượt quá số chỗ còn lại (${remainingSeats})`)
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
          tourId: tour.id,
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
            priceType: item.priceType,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        paymentRequests: data.paymentRequests.map((payment) => ({
          amount: finalTotal,
          method: payment.method,
          status: payment.status,
          transactionCode: payment.transactionCode,
          provider: payment.provider,
          paidAt: payment.paidAt ?? undefined,
        })),
        code: data.code,
      }

      const response = await createBooking(payload)
      const booking = response.data

      if (response.code === 201 || response.code === 200) {
        if (!booking) {
          toast.error('Không nhận được thông tin booking sau khi tạo thành công')
          return
        }

        const paymentMethod = String(selectedPaymentMethod ?? PaymentMethod.CASH)

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
        setCurrentStep(1)
        onClose()
      } else {
        toast.error(response.message || 'Đặt tour thất bại')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Có lỗi xảy ra khi đặt tour'
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
    if (currentStep > 2) setCurrentStep(currentStep - 1)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600">
          ✕
        </button>

        {/* Step Indicator */}
        <div className="mb-8 flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                  step < currentStep
                    ? 'bg-blue-600 text-white'
                    : step === currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step < currentStep ? '✓' : step}
              </div>
              <div className={`ml-3 text-sm font-medium ${step <= currentStep ? 'text-slate-900' : 'text-slate-500'}`}>
                {step === 1 && 'Select Tour'}
                {step === 2 && 'Info'}
                {step === 3 && 'Payment'}
                {step === 4 && 'Done'}
              </div>
              {step < 4 && (
                <div
                  className={`mx-3 h-1 w-12 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Section - Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit(onSubmit, () => {
                toast.error('Vui lòng điền đầy đủ và chính xác tất cả các trường')
              })}
            >
              {/* Step 1: Select Tour */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-slate-900">Chọn Tour</h2>
                  <div className="rounded-lg border-2 border-blue-600 bg-blue-50 p-4">
                    <p className="font-semibold text-slate-900">{tour.title}</p>
                    <p className="text-sm text-slate-600">{tour.location} • {tour.duration}</p>
                  </div>
                </div>
              )}

              {/* Step 2: Customer Information & Departure */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-slate-900">
                      <span className="text-2xl">👤</span> Customer Information
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">First Name</label>
                        <input
                          type="text"
                          {...register('contactFullname')}
                          placeholder="Alex"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                        {errors.contactFullname && (
                          <p className="mt-1 text-xs text-rose-600">{errors.contactFullname.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Last Name</label>
                        <input
                          type="text"
                          placeholder="Walker"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
                        <input
                          type="email"
                          {...register('contactEmail')}
                          placeholder="alex.walker@example.com"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                        {errors.contactEmail && (
                          <p className="mt-1 text-xs text-rose-600">{errors.contactEmail.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Phone Number</label>
                        <input
                          type="tel"
                          {...register('contactPhone')}
                          placeholder="+1 (555) 000-0000"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                        {errors.contactPhone && (
                          <p className="mt-1 text-xs text-rose-600">{errors.contactPhone.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Special Requirements (Optional)
                      </label>
                      <textarea
                        {...register('contactAddress')}
                        placeholder="Dietary restrictions, accessibility needs, etc."
                        rows={4}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                      {errors.contactAddress && (
                        <p className="mt-1 text-xs text-rose-600">{errors.contactAddress.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                      <span className="text-xl">📅</span> Departure Selection
                    </h3>
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
                          <p className="font-semibold text-slate-900">
                            {new Date(detail.startDay).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="text-sm text-slate-600">
                            {new Date(detail.startDay).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })}{' '}
                            Departure
                          </p>
                          <p className="text-xs text-slate-500">
                            {detail.remainingSeats > 5 ? 'Available' : 'Fast filling'}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-slate-900">
                    <span className="text-2xl">💳</span> Payment Method
                  </h2>

                  {/* Booking Items */}
                  <div className="rounded-lg border border-slate-200 p-4">
                    <h3 className="mb-3 font-semibold text-slate-900">Travelers</h3>
                    <div className="space-y-2">
                      {derivedBookingItems.map((item) => (
                        <div key={item.priceType} className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">
                            {item.priceType === PriceType.ADULT ? 'Người lớn' : 'Trẻ em'} ({item.quantity}x)
                          </span>
                          <span className="font-semibold text-slate-900">{formatVnd(item.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-3">
                    {[PaymentMethod.MOMO, PaymentMethod.VNPAY, PaymentMethod.CASH].map((method) => (
                      <label key={method} className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-slate-200 p-4 transition hover:border-slate-300">
                        <input
                          type="radio"
                          {...register('paymentRequests.0.method')}
                          value={method}
                          checked={selectedPaymentMethod === method}
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-semibold text-slate-900">
                          {method === PaymentMethod.MOMO && '📱 MOMO'}
                          {method === PaymentMethod.VNPAY && '💳 VNPAY'}
                          {method === PaymentMethod.CASH && '💵 Cash Payment'}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Voucher Code */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Voucher Code (Optional)</label>
                    <input
                      type="text"
                      {...register('code')}
                      placeholder="Enter voucher code"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div className="space-y-4 text-center">
                  <div className="flex justify-center">
                    <div className="text-6xl">✅</div>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h2>
                  <p className="text-slate-600">Thank you for your booking. A confirmation email has been sent to {contactEmail}</p>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="mt-8 flex gap-3 border-t border-slate-200 pt-6">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={currentStep === 1 ? onClose : handlePrevStep}
                      className="flex-1 rounded-lg border border-slate-200 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      {currentStep === 1 ? 'Close' : 'Back'}
                    </button>
                  )}
                  {currentStep === 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
                    >
                      Next
                    </button>
                  )}
                  {currentStep === 2 && (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={!isStep2Valid}
                      className="flex-1 rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      Next
                    </button>
                  )}
                  {currentStep === 3 && (
                    <button
                      type="submit"
                      disabled={isSubmitting || !isStep3Valid}
                      className="flex-1 rounded-lg bg-orange-600 py-2 font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                  )}
                </div>
              )}

              {currentStep === 4 && (
                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      setCurrentStep(1)
                      reset()
                    }}
                    className="rounded-lg bg-blue-600 px-8 py-2 font-semibold text-white hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Right Section - Summary */}
          <div>
            <div className="sticky top-0 space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={tour.gallery?.[0] || tour.imageUrl}
                  alt={tour.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">{tour.title}</h3>
                <p className="text-xs text-slate-600">
                  📅 {selectedDetail ? formatDate(selectedDetail.startDay) : 'Select date'} • ⏱️ {tour.duration}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-3">
                {derivedBookingItems.map((item) => {
                  return (
                    <div key={item.priceType} className="flex justify-between text-xs text-slate-600">
                      <span>{item.priceType === PriceType.ADULT ? 'Người lớn' : 'Trẻ em'} ({item.quantity}x)</span>
                      <span className="font-semibold text-slate-900">{formatVnd(item.total)}</span>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-2 border-t border-slate-200 pt-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatVnd(totalPrice)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-lg font-bold text-blue-600">
                  <span>Total</span>
                  <span>{formatVnd(finalTotal)}</span>
                </div>
              </div>

              {currentStep === 3 && (
                <button
                  type="button"
                  onClick={() => {
                    handleSubmit(onSubmit)()
                  }}
                  disabled={isSubmitting}
                  className="mt-4 w-full rounded-lg bg-orange-600 py-3 font-bold text-white hover:bg-orange-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                </button>
              )}

              <p className="text-center text-xs text-slate-600">By proceeding, you agree to our Terms & Conditions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

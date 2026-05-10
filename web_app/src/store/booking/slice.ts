import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import * as bookingApi from '../../api/booking/booking.api'
import type { BookingQueryRequest, BookingResponse } from '../../types/booking/booking.type'
import type { BookingStatus } from '../../types/enums/BookingStatus.enum'
import type { PaymentMethod } from '../../types/enums/PaymentMethod.enum'
import type { PaymentStatus } from '../../types/enums/PaymentStatus.enum'
import type { PageResponse } from '../../types/pagination.type'

type BookingStatusFilter = 'ALL' | BookingStatus
type PaymentStatusFilter = 'ALL' | PaymentStatus
type PaymentMethodFilter = 'ALL' | PaymentMethod

interface BookingState {
  bookings: BookingResponse[]
  pageNumber: number
  size: number
  totalElements: number
  totalPages: number
  keyword: string
  bookingStatusFilter: BookingStatusFilter
  paymentStatusFilter: PaymentStatusFilter
  paymentMethodFilter: PaymentMethodFilter
  minTotalPrice: string
  maxTotalPrice: string
  expiredOnly: boolean
  loading: boolean
  error: string | null
}

const initialState: BookingState = {
  bookings: [],
  pageNumber: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  keyword: '',
  bookingStatusFilter: 'ALL',
  paymentStatusFilter: 'ALL',
  paymentMethodFilter: 'ALL',
  minTotalPrice: '',
  maxTotalPrice: '',
  expiredOnly: false,
  loading: false,
  error: null,
}

export const fetchBookings = createAsyncThunk(
  'booking/fetchBookings',
  async (payload: BookingQueryRequest | undefined, { rejectWithValue }) => {
    try {
      const { pageNumber = 0, size = 10, ...query } = payload ?? {}
      const res = await bookingApi.filterBookings({
        pageNumber,
        size,
        sortBy: 'createdAt',
        sortDir: 'desc',
        ...query,
      })

      if (res.code !== 200 || !res.data) return rejectWithValue(res)
      return res.data as PageResponse<BookingResponse>
    } catch (err: unknown) {
      return rejectWithValue(err)
    }
  },
)

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setKeyword(state, action: PayloadAction<string>) {
      state.keyword = action.payload
    },
    setPageNumber(state, action: PayloadAction<number>) {
      state.pageNumber = action.payload
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.size = action.payload
      state.pageNumber = 0
    },
    setBookingStatusFilter(state, action: PayloadAction<BookingStatusFilter>) {
      state.bookingStatusFilter = action.payload
      state.pageNumber = 0
    },
    setPaymentStatusFilter(state, action: PayloadAction<PaymentStatusFilter>) {
      state.paymentStatusFilter = action.payload
      state.pageNumber = 0
    },
    setPaymentMethodFilter(state, action: PayloadAction<PaymentMethodFilter>) {
      state.paymentMethodFilter = action.payload
      state.pageNumber = 0
    },
    setMinTotalPrice(state, action: PayloadAction<string>) {
      state.minTotalPrice = action.payload
      state.pageNumber = 0
    },
    setMaxTotalPrice(state, action: PayloadAction<string>) {
      state.maxTotalPrice = action.payload
      state.pageNumber = 0
    },
    setExpiredOnly(state, action: PayloadAction<boolean>) {
      state.expiredOnly = action.payload
      state.pageNumber = 0
    },
    resetFilters(state) {
      state.keyword = ''
      state.bookingStatusFilter = 'ALL'
      state.paymentStatusFilter = 'ALL'
      state.paymentMethodFilter = 'ALL'
      state.minTotalPrice = ''
      state.maxTotalPrice = ''
      state.expiredOnly = false
      state.pageNumber = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookings.fulfilled, (state, action: PayloadAction<PageResponse<BookingResponse>>) => {
        state.loading = false
        state.bookings = action.payload.content || []
        state.pageNumber = action.payload.pageNumber ?? state.pageNumber
        state.size = action.payload.size ?? state.size
        state.totalElements = action.payload.totalElements ?? 0
        state.totalPages = action.payload.totalPages ?? 0
      })
      .addCase(fetchBookings.rejected, (state, action: unknown) => {
        const err = action as { payload?: { message?: string }; error?: { message?: string } }
        state.loading = false
        state.error = err.payload?.message || err.error?.message || 'Khong the tai danh sach booking'
      })
  },
})

export const {
  setKeyword,
  setPageNumber,
  setPageSize,
  setBookingStatusFilter,
  setPaymentStatusFilter,
  setPaymentMethodFilter,
  setMinTotalPrice,
  setMaxTotalPrice,
  setExpiredOnly,
  resetFilters,
} = bookingSlice.actions

export default bookingSlice.reducer

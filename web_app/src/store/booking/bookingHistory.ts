import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import * as bookingApi from '../../api/booking/booking.api'
import type { BookingResponse } from '../../types/booking/booking.type'
import type { BookingStatus } from '../../types/enums/BookingStatus.enum'

interface BookingHistoryState {
  bookings: BookingResponse[]
  loading: boolean
  error: string | null
  statusFilter: 'ALL' | BookingStatus
}

const initialState: BookingHistoryState = {
  bookings: [],
  loading: false,
  error: null,
  statusFilter: 'ALL',
}

export const fetchBookingHistory = createAsyncThunk(
  'bookingHistory/fetchBookingHistory',
  async (_, { rejectWithValue }) => {
    try {
      const res = await bookingApi.getMe()
      if (res.code !== 200 || !res.data) return rejectWithValue(res)
      return res.data as BookingResponse[]
    } catch (err: unknown) {
      return rejectWithValue(err)
    }
  },
)

const bookingHistorySlice = createSlice({
  name: 'bookingHistory',
  initialState,
  reducers: {
    setStatusFilter(state, action: PayloadAction<'ALL' | BookingStatus>) {
      state.statusFilter = action.payload
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookingHistory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookingHistory.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = action.payload
      })
      .addCase(fetchBookingHistory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Lỗi khi tải lịch sử booking'
      })
  },
})

export const { setStatusFilter, clearError } = bookingHistorySlice.actions
export default bookingHistorySlice.reducer

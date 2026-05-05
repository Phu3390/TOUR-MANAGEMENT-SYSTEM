import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import * as tourApi from '../../api/tour/tour.api'
import type { PageResponse } from '../../types/pagination.type'
import type { CreateTourRequest, TourQueryRequest, TourResponse, UploadImageResponse } from '../../types/tour/tour.type'
import type { TourStatus } from '../../types/enums/TourStatus.enum'

interface TourState {
  tours: TourResponse[]
  pageNumber: number
  size: number
  totalElements: number
  totalPages: number
  keyword: string
  statusFilter: 'ALL' | TourStatus
  loading: boolean
  submitting: boolean
  uploadingImage: boolean
  error: string | null
}

const initialState: TourState = {
  tours: [],
  pageNumber: 0,
  size: 5,
  totalElements: 0,
  totalPages: 0,
  keyword: '',
  statusFilter: 'ALL',
  loading: false,
  submitting: false,
  uploadingImage: false,
  error: null,
}

export const fetchTours = createAsyncThunk(
  'tour/fetchTours',
  async (payload: TourQueryRequest | undefined, { rejectWithValue }) => {
    try {
      const { pageNumber = 0, size = 5, ...query } = payload ?? {}

      const res = await tourApi.filterTours({
        pageNumber,
        size,
        sortBy: 'id',
        sortDir: 'desc',
        ...query,
      })
      if (res.code !== 200 || !res.data) return rejectWithValue(res)
      return res.data as PageResponse<TourResponse>
    } catch (err: unknown) {
      return rejectWithValue(err)
    }
  },
)

export const createTour = createAsyncThunk(
  'tour/createTour',
  async (payload: CreateTourRequest, { rejectWithValue }) => {
    try {
      const res = await tourApi.createFullTour(payload)
      if (res.code !== 200 || !res.data) return rejectWithValue(res)
      return res.data as TourResponse
    } catch (err: unknown) {
      return rejectWithValue(err)
    }
  },
)

export const uploadTourImage = createAsyncThunk(
  'tour/uploadTourImage',
  async (image: File, { rejectWithValue }) => {
    try {
      const res = await tourApi.uploadImage(image)
      if (res.code !== 200 || !res.data) return rejectWithValue(res)
      return res.data as UploadImageResponse
    } catch (err: unknown) {
      return rejectWithValue(err)
    }
  },
)

const tourSlice = createSlice({
  name: 'tour',
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
    setStatusFilter(state, action: PayloadAction<'ALL' | TourStatus>) {
      state.statusFilter = action.payload
      state.pageNumber = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTours.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTours.fulfilled, (state, action: PayloadAction<PageResponse<TourResponse>>) => {
        state.loading = false
        state.tours = action.payload.content || []
        state.pageNumber = action.payload.pageNumber ?? state.pageNumber
        state.size = action.payload.size ?? state.size
        state.totalElements = action.payload.totalElements ?? 0
        state.totalPages = action.payload.totalPages ?? 0
      })
      .addCase(fetchTours.rejected, (state, action: unknown) => {
        const err = action as { payload?: { message?: string }; error?: { message?: string } }
        state.loading = false
        state.error = err.payload?.message || err.error?.message || 'Không thể tải danh sách tour'
      })
      .addCase(createTour.pending, (state) => {
        state.submitting = true
        state.error = null
      })
      .addCase(createTour.fulfilled, (state, action: PayloadAction<TourResponse>) => {
        state.submitting = false
        state.tours = [action.payload, ...state.tours]
        state.totalElements += 1
      })
      .addCase(createTour.rejected, (state, action: unknown) => {
        const err = action as { payload?: { message?: string }; error?: { message?: string } }
        state.submitting = false
        state.error = err.payload?.message || err.error?.message || 'Tạo tour thất bại'
      })
      .addCase(uploadTourImage.pending, (state) => {
        state.uploadingImage = true
        state.error = null
      })
      .addCase(uploadTourImage.fulfilled, (state) => {
        state.uploadingImage = false
      })
      .addCase(uploadTourImage.rejected, (state, action: unknown) => {
        const err = action as { payload?: { message?: string }; error?: { message?: string } }
        state.uploadingImage = false
        state.error = err.payload?.message || err.error?.message || 'Tải ảnh bìa thất bại'
      })
  },
})

export const { setKeyword, setPageNumber, setPageSize, setStatusFilter } = tourSlice.actions

export default tourSlice.reducer

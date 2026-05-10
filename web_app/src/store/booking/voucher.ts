import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import * as voucherApi from '../../api/booking/voucher.api'
import type { VoucherQueryRequest, VoucherRequest, VoucherResponse } from '../../types/booking/voucher.type'
import type { PageResponse } from '../../types/pagination.type'

type VoucherStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE' | 'EXPIRED'

interface VoucherState {
  vouchers: VoucherResponse[]
  pageNumber: number
  size: number
  totalElements: number
  totalPages: number
  keyword: string
  statusFilter: VoucherStatusFilter
  minDiscountPercent: string
  maxDiscountPercent: string
  minDiscountAmount: string
  maxDiscountAmount: string
  minQuantity: string
  maxQuantity: string
  loading: boolean
  submitting: boolean
  error: string | null
}

const initialState: VoucherState = {
  vouchers: [],
  pageNumber: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  keyword: '',
  statusFilter: 'ALL',
  minDiscountPercent: '',
  maxDiscountPercent: '',
  minDiscountAmount: '',
  maxDiscountAmount: '',
  minQuantity: '',
  maxQuantity: '',
  loading: false,
  submitting: false,
  error: null,
}

export const fetchVouchers = createAsyncThunk(
  'voucher/fetchVouchers',
  async (payload: VoucherQueryRequest | undefined, { rejectWithValue }) => {
    try {
      const { pageNumber = 0, size = 10, ...query } = payload ?? {}
      const res = await voucherApi.filterVouchers({
        pageNumber,
        size,
        sortBy: 'createdAt',
        sortDir: 'desc',
        ...query,
      })

      if (res.code !== 200 || !res.data) return rejectWithValue(res)
      return res.data as PageResponse<VoucherResponse>
    } catch (err: unknown) {
      return rejectWithValue(err)
    }
  },
)

export const createVoucher = createAsyncThunk(
  'voucher/createVoucher',
  async (payload: VoucherRequest, { rejectWithValue }) => {
    try {
      const res = await voucherApi.createVoucher(payload)
      if (res.code !== 200 || !res.data) return rejectWithValue(res)
      return res.data as VoucherResponse
    } catch (err: unknown) {
      return rejectWithValue(err)
    }
  },
)

export const updateVoucher = createAsyncThunk(
  'voucher/updateVoucher',
  async (params: { id: string; data: VoucherRequest }, { rejectWithValue }) => {
    try {
      const res = await voucherApi.updateVoucher(params.id, params.data)
      if (res.code !== 200 || !res.data) return rejectWithValue(res)
      return res.data as VoucherResponse
    } catch (err: unknown) {
      return rejectWithValue(err)
    }
  },
)

export const editStatus = createAsyncThunk(
  'voucher/editStatus',
  async (params: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const res = await voucherApi.editStatus(params.id, params.status)
      if (res.code !== 200) return rejectWithValue(res)
      return { id: params.id, status: params.status } as { id: string; status: string }
    } catch (err: unknown) {
      return rejectWithValue(err)
    }
  },
)

const voucherSlice = createSlice({
  name: 'voucher',
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
    setStatusFilter(state, action: PayloadAction<VoucherStatusFilter>) {
      state.statusFilter = action.payload
      state.pageNumber = 0
    },
    setMinDiscountPercent(state, action: PayloadAction<string>) {
      state.minDiscountPercent = action.payload
      state.pageNumber = 0
    },
    setMaxDiscountPercent(state, action: PayloadAction<string>) {
      state.maxDiscountPercent = action.payload
      state.pageNumber = 0
    },
    setMinDiscountAmount(state, action: PayloadAction<string>) {
      state.minDiscountAmount = action.payload
      state.pageNumber = 0
    },
    setMaxDiscountAmount(state, action: PayloadAction<string>) {
      state.maxDiscountAmount = action.payload
      state.pageNumber = 0
    },
    setMinQuantity(state, action: PayloadAction<string>) {
      state.minQuantity = action.payload
      state.pageNumber = 0
    },
    setMaxQuantity(state, action: PayloadAction<string>) {
      state.maxQuantity = action.payload
      state.pageNumber = 0
    },
    resetFilters(state) {
      state.keyword = ''
      state.statusFilter = 'ALL'
      state.minDiscountPercent = ''
      state.maxDiscountPercent = ''
      state.minDiscountAmount = ''
      state.maxDiscountAmount = ''
      state.minQuantity = ''
      state.maxQuantity = ''
      state.pageNumber = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVouchers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVouchers.fulfilled, (state, action) => {
        state.loading = false
        state.vouchers = action.payload.content || []
        state.pageNumber = action.payload.pageNumber || 0
        state.size = action.payload.pageSize || 10
        state.totalElements = action.payload.totalElements || 0
        state.totalPages = action.payload.totalPages || 0
      })
      .addCase(fetchVouchers.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as any)?.message || 'Lỗi khi tải voucher'
      })
      .addCase(createVoucher.pending, (state) => {
        state.submitting = true
        state.error = null
      })
      .addCase(createVoucher.fulfilled, (state) => {
        state.submitting = false
      })
      .addCase(createVoucher.rejected, (state, action) => {
        state.submitting = false
        state.error = (action.payload as any)?.message || 'Lỗi khi tạo voucher'
      })
      .addCase(updateVoucher.pending, (state) => {
        state.submitting = true
        state.error = null
      })
      .addCase(updateVoucher.fulfilled, (state, action) => {
        state.submitting = false
        state.vouchers = state.vouchers.map((v) => (v.id === action.payload.id ? action.payload : v))
      })
      .addCase(updateVoucher.rejected, (state, action) => {
        state.submitting = false
        state.error = (action.payload as any)?.message || 'Lỗi khi cập nhật voucher'
      })
      .addCase(editStatus.pending, (state) => {
        state.submitting = true
        state.error = null
      })
      .addCase(editStatus.fulfilled, (state, action) => {
        state.submitting = false
        state.vouchers = state.vouchers.map((v) =>
          v.id === action.payload.id ? { ...v, status: action.payload.status as VoucherResponse['status'] } : v,
        )
      })
      .addCase(editStatus.rejected, (state, action) => {
        state.submitting = false
        state.error = (action.payload as any)?.message || 'Lỗi khi cập nhật trạng thái'
      })
  },
})

export const {
  setKeyword,
  setPageNumber,
  setPageSize,
  setStatusFilter,
  setMinDiscountPercent,
  setMaxDiscountPercent,
  setMinDiscountAmount,
  setMaxDiscountAmount,
  setMinQuantity,
  setMaxQuantity,
  resetFilters,
} = voucherSlice.actions

export default voucherSlice.reducer

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import * as roleApi from '../../api/auth/role.api'
import type { RoleAndRolePermissionRequest, RoleQueryRequest, RoleResponse } from '../../types/auth/role.type'
import type { PageResponse } from '../../types/pagination.type'

interface RoleState {
  roles: RoleResponse[]
  pageNumber: number
  size: number
  totalElements: number
  totalPages: number
  keyword: string
  statusFilter: 'ALL' | 'ACTIVE' | 'INACTIVE'
  loading: boolean
  submitting: boolean
  error: string | null
}

const initialState: RoleState = {
  roles: [],
  pageNumber: 0,
  size: 5,
  totalElements: 0,
  totalPages: 0,
  keyword: '',
  statusFilter: 'ALL',
  loading: false,
  submitting: false,
  error: null,
}

export const fetchRoles = createAsyncThunk(
  'role/fetchRoles',
  async (payload: RoleQueryRequest | undefined, { rejectWithValue }) => {
    try {
      const res = await roleApi.filterRoles({
        pageNumber: 0,
        size: 5,
        sortBy: 'id',
        sortDir: 'desc',
        ...payload,
      })
      if (res.code !== 200 || !res.data) {
        return rejectWithValue(res)
      }
      return res.data as PageResponse<RoleResponse>
    } catch (err: unknown) {
      return rejectWithValue(err)
    }
  },
)

export const createRole = createAsyncThunk(
  'role/createRole',
  async (payload: RoleAndRolePermissionRequest, { rejectWithValue }) => {
    try {
      await roleApi.create(payload)
      return payload
    } catch (err: unknown) {
      return rejectWithValue(err)
    }
  },
)

export const updateRole = createAsyncThunk(
  'role/updateRole',
  async (payload: { id: string; data: RoleAndRolePermissionRequest }, { rejectWithValue }) => {
    try {
      await roleApi.update(payload.id, payload.data)
      return payload.id
    } catch (err: unknown) {
      return rejectWithValue(err)
    }
  },
)

export const lockRole = createAsyncThunk('role/lockRole', async (id: string, { rejectWithValue }) => {
  try {
    await roleApi.lockById(id)
    return id
  } catch (err: unknown) {
    return rejectWithValue(err)
  }
})

export const unlockRole = createAsyncThunk('role/unlockRole', async (id: string, { rejectWithValue }) => {
  try {
    await roleApi.unLockById(id)
    return id
  } catch (err: unknown) {
    return rejectWithValue(err)
  }
})

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setKeyword(state, action: PayloadAction<string>) {
      state.keyword = action.payload
    },
    setPageNumber(state, action: PayloadAction<number>) {
      state.pageNumber = action.payload
    },
    setStatusFilter(state, action: PayloadAction<'ALL' | 'ACTIVE' | 'INACTIVE'>) {
      state.statusFilter = action.payload
      state.pageNumber = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRoles.fulfilled, (state, action: PayloadAction<PageResponse<RoleResponse>>) => {
        state.loading = false
        state.roles = action.payload.content || []
        state.pageNumber = action.payload.pageNumber ?? 0
        state.size = action.payload.size ?? state.size
        state.totalElements = action.payload.totalElements ?? 0
        state.totalPages = action.payload.totalPages ?? 0
      })
      .addCase(fetchRoles.rejected, (state, action: unknown) => {
        const err = action as { payload?: { message?: string }; error?: { message?: string } }
        state.loading = false
        state.error = err.payload?.message || err.error?.message || 'Khong the tai danh sach vai tro'
      })
      .addCase(createRole.pending, (state) => {
        state.submitting = true
      })
      .addCase(createRole.fulfilled, (state) => {
        state.submitting = false
      })
      .addCase(createRole.rejected, (state, action: unknown) => {
        const err = action as { payload?: { message?: string }; error?: { message?: string } }
        state.submitting = false
        state.error = err.payload?.message || err.error?.message || 'Tao vai tro that bai'
      })
      .addCase(updateRole.pending, (state) => {
        state.submitting = true
      })
      .addCase(updateRole.fulfilled, (state) => {
        state.submitting = false
      })
      .addCase(updateRole.rejected, (state, action: unknown) => {
        const err = action as { payload?: { message?: string }; error?: { message?: string } }
        state.submitting = false
        state.error = err.payload?.message || err.error?.message || 'Cap nhat vai tro that bai'
      })
      .addCase(lockRole.pending, (state) => {
        state.submitting = true
      })
      .addCase(lockRole.fulfilled, (state, action: PayloadAction<string>) => {
        state.submitting = false
        const role = state.roles.find((item) => item.id === action.payload)
        if (role) role.status = 'INACTIVE'
      })
      .addCase(lockRole.rejected, (state, action: unknown) => {
        const err = action as { payload?: { message?: string }; error?: { message?: string } }
        state.submitting = false
        state.error = err.payload?.message || err.error?.message || 'Khoa vai tro that bai'
      })
      .addCase(unlockRole.pending, (state) => {
        state.submitting = true
      })
      .addCase(unlockRole.fulfilled, (state, action: PayloadAction<string>) => {
        state.submitting = false
        const role = state.roles.find((item) => item.id === action.payload)
        if (role) role.status = 'ACTIVE'
      })
      .addCase(unlockRole.rejected, (state, action: unknown) => {
        const err = action as { payload?: { message?: string }; error?: { message?: string } }
        state.submitting = false
        state.error = err.payload?.message || err.error?.message || 'Mo khoa vai tro that bai'
      })
  },
})

export const { setKeyword, setPageNumber, setStatusFilter } = roleSlice.actions

export default roleSlice.reducer

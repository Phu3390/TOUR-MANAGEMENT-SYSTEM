import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import * as userApi from '../../api/auth/user.api'
import type { UpdateUserRequest, UserRequest, UserResponse, UserQueryRequest } from '../../types/auth/user.type'
import type { PageResponse } from '../../types/pagination.type'
import { Status } from '../../types/enums/Status.enum'

interface UserState {
  users: UserResponse[]
  pageNumber: number
  size: number
  totalElements: number
  totalPages: number
  keyword: string
  statusFilter: 'ALL' | 'ACTIVE' | 'INACTIVE'
  roleFilter: string
  loading: boolean
  submitting: boolean
  error: string | null
}

const initialState: UserState = {
  users: [],
  pageNumber: 0,
  size: 5,
  totalElements: 0,
  totalPages: 0,
  keyword: '',
  statusFilter: 'ALL',
  roleFilter: 'ALL',
  loading: false,
  submitting: false,
  error: null,
}

export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (payload: UserQueryRequest | undefined, { rejectWithValue }) => {
    try {
      const res = await userApi.filterUsers({
        pageNumber: 0,
        size: 5,
        sortBy: 'id',
        sortDir: 'desc',
        ...payload,
      })
      if (res.code !== 200 || !res.data) {
        return rejectWithValue(res)
      }
      return res.data as PageResponse<UserResponse>
    } catch (err: unknown) {
      return rejectWithValue(err)
    }
  },
)

export const createUser = createAsyncThunk(
  'user/createUser',
  async (payload: UserRequest, { rejectWithValue }) => {
    try {
      const res = await userApi.create(payload)
      if (res.code !== 200 || !res.data) {
        return rejectWithValue(res)
      }
      return res.data as UserResponse
    } catch (err: unknown) {
      return rejectWithValue(err)
    }
  },
)

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (payload: { id: string; data: UpdateUserRequest }, { rejectWithValue }) => {
    try {
      const res = await userApi.update(payload.id, payload.data)
      if (res.code !== 200 || !res.data) {
        return rejectWithValue(res)
      }
      return res.data as UserResponse
    } catch (err: unknown) {
      return rejectWithValue(err)
    }
  },
)

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      // const res = await userApi.deleteById(id)
      // if (res.code !== 200) {
      //   return rejectWithValue(res)
      // }
      return id
    } catch (err: unknown) {
      return rejectWithValue(err)
    }
  },
)

export const lockUser = createAsyncThunk(
  'user/lockUser',
  async (id: string, { rejectWithValue }) => {
    try {
      await userApi.lockById(id)
      return id
    } catch (err: unknown) {
      return rejectWithValue(err)
    }
  },
)

export const unlockUser = createAsyncThunk(
  'user/unlockUser',
  async (id: string, { rejectWithValue }) => {
    try {
      await userApi.unLockById(id)
      return id
    } catch (err: unknown) {
      return rejectWithValue(err)
    }
  },
)

const userSlice = createSlice({
  name: 'user',
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
    setStatusFilter(state, action: PayloadAction<'ALL' | 'ACTIVE' | 'INACTIVE'>) {
      state.statusFilter = action.payload
      state.pageNumber = 0
    },
    setRoleFilter(state, action: PayloadAction<string>) {
      state.roleFilter = action.payload
      state.pageNumber = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<PageResponse<UserResponse>>) => {
        state.loading = false
        state.users = action.payload.content || []
        state.pageNumber = action.payload.pageNumber ?? 0
        state.size = action.payload.size ?? state.size
        state.totalElements = action.payload.totalElements ?? 0
        state.totalPages = action.payload.totalPages ?? 0
      })
      .addCase(fetchUsers.rejected, (state, action: unknown) => {
        const err = action as { payload?: { message?: string }; error?: { message?: string } }
        state.loading = false
        state.error = err.payload?.message || err.error?.message || 'Khong the tai danh sach nguoi dung'
      })
      .addCase(createUser.pending, (state) => {
        state.submitting = true
      })
      .addCase(createUser.fulfilled, (state) => {
        state.submitting = false
      })
      .addCase(createUser.rejected, (state, action: unknown) => {
        const err = action as { payload?: { message?: string }; error?: { message?: string } }
        state.submitting = false
        state.error = err.payload?.message || err.error?.message || 'Tao nguoi dung that bai'
      })
      .addCase(updateUser.pending, (state) => {
        state.submitting = true
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<UserResponse>) => {
        state.submitting = false
        state.users = state.users.map((user) => (user.id === action.payload.id ? action.payload : user))
      })
      .addCase(updateUser.rejected, (state, action: unknown) => {
        const err = action as { payload?: { message?: string }; error?: { message?: string } }
        state.submitting = false
        state.error = err.payload?.message || err.error?.message || 'Cap nhat nguoi dung that bai'
      })
      .addCase(deleteUser.pending, (state) => {
        state.submitting = true
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.submitting = false
        state.users = state.users.filter((user) => user.id !== action.payload)
      })
      .addCase(deleteUser.rejected, (state, action: unknown) => {
        const err = action as { payload?: { message?: string }; error?: { message?: string } }
        state.submitting = false
        state.error = err.payload?.message || err.error?.message || 'Xoa nguoi dung that bai'
      })
      .addCase(lockUser.pending, (state) => {
        state.submitting = true
      })
      .addCase(lockUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.submitting = false
        const user = state.users.find((u) => u.id === action.payload)
        if (user) user.status = Status.INACTIVE
      })
      .addCase(lockUser.rejected, (state, action: unknown) => {
        const err = action as { payload?: { message?: string }; error?: { message?: string } }
        state.submitting = false
        state.error = err.payload?.message || err.error?.message || 'Khoa nguoi dung that bai'
      })
      .addCase(unlockUser.pending, (state) => {
        state.submitting = true
      })
      .addCase(unlockUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.submitting = false
        const user = state.users.find((u) => u.id === action.payload)
        if (user) user.status = Status.ACTIVE
      })
      .addCase(unlockUser.rejected, (state, action: unknown) => {
        const err = action as { payload?: { message?: string }; error?: { message?: string } }
        state.submitting = false
        state.error = err.payload?.message || err.error?.message || 'Mo khoa nguoi dung that bai'
      })
  },
})

export const { setKeyword, setPageNumber, setPageSize, setStatusFilter, setRoleFilter } = userSlice.actions

export default userSlice.reducer

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import * as authApi from '../../api/auth/auth.api'
import type { LoginRequest, SignupRequest, AuthData, AuthResponse } from '../../types/auth/auth.type'

interface AuthState {
  token: string | null
  authentication: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  authentication: false,
  loading: false,
  error: null,
}

export const login = createAsyncThunk('auth/login', async (payload: LoginRequest, { rejectWithValue }) => {
  try {
    const res: AuthResponse = await authApi.login(payload)
    if (res.code !== 200) return rejectWithValue(res)
    return res.data as AuthData
  } catch (err: any) {
    return rejectWithValue(err)
  }
})

export const signup = createAsyncThunk('auth/signup', async (payload: SignupRequest, { rejectWithValue }) => {
  try {
    const res: AuthResponse = await authApi.signup(payload)
    if (res.code !== 200) return rejectWithValue(res)
    return res.data as AuthData
  } catch (err: any) {
    return rejectWithValue(err)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.authentication = false
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthData>) => {
        state.loading = false
        state.authentication = true
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(login.rejected, (state, action: any) => {
        state.loading = false
        state.error = action.payload?.message || action.error?.message || 'Login failed'
      })
      .addCase(signup.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<AuthData>) => {
        state.loading = false
        state.authentication = true
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(signup.rejected, (state, action: any) => {
        state.loading = false
        state.error = action.payload?.message || action.error?.message || 'Signup failed'
      })
  },
})

export const { logout } = authSlice.actions

export default authSlice.reducer

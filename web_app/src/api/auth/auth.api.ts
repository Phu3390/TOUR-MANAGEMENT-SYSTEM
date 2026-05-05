import api from '../axios'
import type { LoginRequest, SignupRequest, AuthResponse } from '../../types/auth/auth.type'

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const res = await api.post('/auth/login', payload)
  return res.data as AuthResponse
}

export async function signup(payload: SignupRequest): Promise<AuthResponse> {
  const res = await api.post('/auth/signup', payload)
  return res.data as AuthResponse
}

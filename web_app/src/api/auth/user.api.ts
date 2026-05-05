import type { FormUserResponse, PageUserResponse, UpdateUserRequest, UserQueryRequest, UserRequest } from '../../types/auth/user.type'
import api from '../axios'

export async function filterUsers(payload: UserQueryRequest): Promise<PageUserResponse> {
  const res = await api.get('/auth/user/filter', { params: payload })
  return res.data as PageUserResponse
}

export async function getMe(): Promise<FormUserResponse> {
  const res = await api.get('/auth/user/me', {})
  return res.data as FormUserResponse
}


export async function getById(id: string): Promise<FormUserResponse> {
  const res = await api.get(`/auth/user/${id}`, {})
  return res.data as FormUserResponse
}


export async function create(userrequest: UserRequest): Promise<FormUserResponse> {
  const res = await api.post('/auth/user', userrequest)
  return res.data as FormUserResponse
}

export async function update(id: string, userrequest: UpdateUserRequest): Promise<FormUserResponse> {
  const res = await api.put(`/auth/user/${id}`, userrequest)
  return res.data as FormUserResponse
}

export async function lockById(id: string): Promise<void> {
  await api.delete(`/auth/user/lock/${id}`, {})
}

export async function unLockById(id: string): Promise<void> {
  await api.delete(`/auth/user/unlock/${id}`, {})
}



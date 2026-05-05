import type { DetailRoleResponse, PageRoleResponse, RoleAndRolePermissionRequest, RoleQueryRequest, RolesResponse } from '../../types/auth/role.type'
import api from '../axios'


export async function getAll(): Promise<RolesResponse> {
  const res = await api.get('/auth/role', {})
  return res.data as RolesResponse
}

export async function getById(id: string): Promise<DetailRoleResponse> {
  const res = await api.get(`/auth/role/${id}`, {})
  return res.data as DetailRoleResponse
}

export async function filterRoles(payload: RoleQueryRequest): Promise<PageRoleResponse> {
  const res = await api.get('/auth/role/filter', { params: payload })
  return res.data as PageRoleResponse
}

export async function create(payload: RoleAndRolePermissionRequest): Promise<void> {
  await api.post('/auth/rolepermission', payload)
}

export async function update(id: string, payload: RoleAndRolePermissionRequest): Promise<void> {
  await api.put(`/auth/rolepermission/${id}`, payload)
}

export async function lockById(id: string): Promise<void> {
  await api.delete(`/auth/role/lock/${id}`, {})
}

export async function unLockById(id: string): Promise<void> {
  await api.delete(`/auth/role/unlock/${id}`, {})
}


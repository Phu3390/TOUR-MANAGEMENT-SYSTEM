import type { BaseQueryRequest, PageResponse } from '../pagination.type'
import type { ApiResponse } from './auth.type'
import type { PermissionResponse } from './permission.type'

export interface RoleRequest {
    name: string
}

export interface RolePermissionResponse {
    role: RoleResponse
    permission: PermissionResponse
    action: string
}

export interface RoleResponse {
    id: string
    name: string
    status: string
    rolePermissions?: RolePermissionResponse[]
}

export interface RolePermissionRequest {
    permission_id: string
    action: 'create' | 'update' | 'delete' | 'view'
}

export interface RoleAndRolePermissionRequest {
    role_permissions: RolePermissionRequest[]
    role: RoleRequest
}

export interface RoleQueryRequest extends BaseQueryRequest {
    status?: 'ACTIVE' | 'INACTIVE'
}

export type PageRoleResponse = ApiResponse<PageResponse<RoleResponse>>

export type DetailRoleResponse = ApiResponse<RoleResponse>

export type RolesResponse = ApiResponse<RoleResponse[]>

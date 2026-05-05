import type { PermissionsResponse } from "../../types/auth/permission.type"
import api from "../axios"

export async function getAll(): Promise<PermissionsResponse> {
  const res = await api.get('/auth/permission', {})
  return res.data as PermissionsResponse
}
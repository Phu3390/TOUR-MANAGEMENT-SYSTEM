import type { Status } from "../enums/Status.enum";
import type { BaseQueryRequest, PageResponse } from "../pagination.type";
import type { ApiResponse } from "./auth.type";
import type { RoleResponse } from "./role.type";

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: RoleResponse;
  status: Status;
}

export interface UserRequest {
  email: string;
  password: string;
  fullName: string;
  role_id: string;
}

export interface UpdateUserRequest {
  email: string;
  password?: string;
  fullName: string;
  role_id: string;
}

export interface UserQueryRequest extends BaseQueryRequest {
  status?: 'ACTIVE' | 'INACTIVE';
  role?: string;
}


export interface PageUserResponse extends ApiResponse<PageResponse<UserResponse>> {}

export interface UsersResponse extends ApiResponse<UserResponse[]> {}

export interface FormUserResponse extends ApiResponse<UserResponse> {}



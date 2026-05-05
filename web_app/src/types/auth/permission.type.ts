import type { Status } from "../enums/Status.enum";
import type { ApiResponse } from "./auth.type";

export interface PermissionResponse{
    id: string
    name: string
    status: Status;
}

export interface PermissionsResponse extends ApiResponse<PermissionResponse>{}
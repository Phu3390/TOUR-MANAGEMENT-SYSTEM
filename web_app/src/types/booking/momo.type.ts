import type { ApiResponse } from "../ApiResponse.type";

export interface MomoResponse{
    url: string;
    message: string;
}

export interface MomoRequest {
    paymentId: string;
    amount: number;
}

export type MomoReturnResponse = ApiResponse<MomoResponse>;
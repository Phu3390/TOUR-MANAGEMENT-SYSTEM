import type { ApiResponse } from "../ApiResponse.type";

export interface VnPayResponse{
    url: string;
    message: string;
}

export interface VnPayRequest {
    paymentId: string;
    amount: number;
    orderInfo: string;
}

export type VnPayReturnResponse = ApiResponse<VnPayResponse>;
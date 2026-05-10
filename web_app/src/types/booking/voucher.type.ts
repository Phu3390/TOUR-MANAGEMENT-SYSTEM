import type { ApiResponse } from "../ApiResponse.type";
import type { BaseQueryRequest, PageResponse } from "../pagination.type";

export interface VoucherRequest {
  code: string;
  discountPercent: number | null;
  discountAmount: number | null;
  quantity: number;
  startDate: Date;
  endDate: Date;
  status: "ACTIVE" | "INACTIVE" ;
}

export interface VoucherResponse {
  id: string;
  code: string;
  discountPercent: number;
  discountAmount: number;
  quantity: number;
  startDate: Date;
  endDate: Date;
  status: "ACTIVE" | "INACTIVE" ;
  createdAt: Date;
}

export interface VoucherQueryRequest extends BaseQueryRequest {
  // exact filter
  code?: string;
  status?: string;

  // discount percent
  minDiscountPercent?: number;
  maxDiscountPercent?: number;

  // discount amount
  minDiscountAmount?: number;
  maxDiscountAmount?: number;

  // quantity
  minQuantity?: number;
  maxQuantity?: number;

  // start date
  startDateFrom?: string;
  startDateTo?: string;

  // end date
  endDateFrom?: string;
  endDateTo?: string;

  // created at
  createdAtFrom?: string;
  createdAtTo?: string;
}


export type PageVoucherResponse = ApiResponse<PageResponse<VoucherResponse>>;

export type DetailVoucherResponse = ApiResponse<VoucherResponse>;
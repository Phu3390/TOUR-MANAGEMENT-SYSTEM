import type { ApiResponse } from "../ApiResponse.type";
import type { BookingStatus } from "../enums/BookingStatus.enum";
import type { PaymentMethod } from "../enums/PaymentMethod.enum";
import type { PaymentStatus } from "../enums/PaymentStatus.enum";
import type { BaseQueryRequest, PageResponse } from "../pagination.type";
import type { BookingItemResponse } from "./bookingitem.type";
import type { PaymentResponse } from "./payment.type";
import type { BookingVoucherResponse } from "./bookingvoucher.type";

export interface BookingResponse {
  id: string;
  userId: string;
  tourId: string;
  tourName: string;
  tourDetailId: string;
  contactFullname: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  totalPrice: number;
  status: BookingStatus;
  note: string;
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
  items: BookingItemResponse[];
  payments: PaymentResponse[];
  bookingVouchers: BookingVoucherResponse[];
}

export interface BookingRequest {
  tourId: string;
  tourDetailId: string;
  contactFullname: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  totalPrice: number;
  status: BookingStatus;
  note?: string;
}

export interface BookingQueryRequest extends BaseQueryRequest {
  userId?: string;
  tourId?: string;
  tourDetailId?: string;
  bookingStatus?: BookingStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  voucherCode?: string;
  minTotalPrice?: number;
  maxTotalPrice?: number;
  createdFrom?: Date;
  createdTo?: Date;
  expiredFrom?: Date;
  expiredTo?: Date;
  expiredOnly?: boolean;
}


export type PageBookingResponse = ApiResponse<PageResponse<BookingResponse>>

export type BookingDetailResponse = ApiResponse<BookingResponse>

export type ListBookingDetailResponse = ApiResponse<BookingResponse[]>
import type { PaymentMethod } from "../enums/PaymentMethod.enum";
import type { PaymentStatus } from "../enums/PaymentStatus.enum";
import type { BookingResponse } from "./booking.type";

export interface PaymentResponse {
  id: string;
  booking: BookingResponse;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionCode: string;
  createdAt: Date;
  updatedAt: Date;
  provider: string;
  paidAt: Date;
}

export interface PaymentRequest {
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionCode: string;
  provider: string;
  paidAt?: Date;
}

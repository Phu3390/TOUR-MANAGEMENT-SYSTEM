import type { BookingRequest } from "./booking.type";
import type { BookingItemRequest } from "./bookingitem.type";
import type { PaymentRequest } from "./payment.type";

export interface CreateBookingRequest{
    bookingRequest: BookingRequest;
    bookingItems: BookingItemRequest[];
    paymentRequests: PaymentRequest[];

    code?: string;
}
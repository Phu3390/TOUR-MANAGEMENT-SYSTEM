import type { BookingResponse } from "./booking.type";
import type { VoucherResponse } from "./voucher.type";

export interface BookingVoucherRequest {
      voucher_id: string;
}

export interface BookingVoucherResponse {
    id: string;
    booking: BookingResponse;
    voucher: VoucherResponse;
}

package com.example.booking.dto.request;

import java.util.List;

import com.example.booking.validator.voucher.VoucherActive;
import com.example.booking.validator.voucher.VoucherExists;
import com.example.booking.validator.voucher.VoucherHasQuantity;
import com.example.booking.validator.voucher.VoucherNotExpired;
import com.example.common.exception.ErrorCode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingRequest {
    private BookingRequest bookingRequest;
    private List<BookingItemRequest> bookingItems;
    private List<PaymentRequest> paymentRequests;

    @VoucherExists(message = "VOUCHER_NOT_FOUND")
    @VoucherActive(message = "Voucher_Is_Not_Active")
    @VoucherNotExpired(message = "Voucher_Is_Expired")
    @VoucherHasQuantity(message = "Voucher_Has_No_Quantity")
    private String code;
}

package com.example.booking.dto.response;

import java.util.UUID;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingVoucherResponse {
    private UUID id;
    private BookingResponse booking;
    private VoucherResponse voucher;
}

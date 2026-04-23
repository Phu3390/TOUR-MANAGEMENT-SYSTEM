package com.example.booking.dto.request;

import java.util.UUID;

import com.example.booking.entity.Booking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingVoucherRequest {
    // private UUID booking_id;
    private UUID voucher_id;
}

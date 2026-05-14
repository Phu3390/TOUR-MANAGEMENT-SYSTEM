package com.example.booking.dto.request;

import java.util.UUID;

import com.example.booking.entity.Booking;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingVoucherRequest {
    @NotNull(message = "VOUCHER_ID_REQUIRED")
    private UUID voucher_id;
}

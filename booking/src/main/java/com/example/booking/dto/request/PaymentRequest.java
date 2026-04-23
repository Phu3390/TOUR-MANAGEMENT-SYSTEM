package com.example.booking.dto.request;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.example.booking.entity.Booking;
import com.example.common.enums.PaymentMethod;
import com.example.common.enums.PaymentStatus;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    // private UUID booking_id;
    private BigDecimal amount;
    private PaymentStatus status;
    private PaymentMethod method;  // VNPAY, MOMO, CASH
    private String transactionCode;
    private String provider;
    private LocalDateTime paidAt;
}

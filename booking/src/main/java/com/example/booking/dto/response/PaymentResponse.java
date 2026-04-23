package com.example.booking.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.example.booking.entity.Booking;
import com.example.common.enums.PaymentMethod;
import com.example.common.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private UUID id;
    private BookingResponse booking;
    private BigDecimal amount;
    private PaymentMethod method;
    private PaymentStatus status;
    private String transactionCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String provider;
    private LocalDateTime paidAt;
}

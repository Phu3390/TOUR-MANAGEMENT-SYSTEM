package com.example.booking.dto.request;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VnPayRequest {
    private String paymentId;
    private String orderInfo;
    private long amount;
}

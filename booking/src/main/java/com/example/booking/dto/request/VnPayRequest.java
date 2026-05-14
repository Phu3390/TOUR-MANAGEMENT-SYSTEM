package com.example.booking.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VnPayRequest {
    @NotBlank(message = "PAYMENT_ID_REQUIRED")
    private String paymentId;

    private String orderInfo;

    @NotNull(message = "AMOUNT_REQUIRED")
    @Min(value = 1, message = "AMOUNT_MIN")
    private Long amount;
}

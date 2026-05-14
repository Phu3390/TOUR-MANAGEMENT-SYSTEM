package com.example.booking.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MomoRequest {
    @NotBlank(message = "PAYMENT_ID_REQUIRED")
    private String paymentId;

    @NotNull(message = "AMOUNT_REQUIRED")
    @Min(value = 1, message = "AMOUNT_MIN")
    private Long amount;
}

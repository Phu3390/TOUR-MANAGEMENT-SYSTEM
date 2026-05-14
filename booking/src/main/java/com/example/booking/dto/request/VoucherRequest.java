package com.example.booking.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
public class VoucherRequest {
    @NotBlank(message = "CODE_REQUIRED")
    private String code;

    private Integer discountPercent;
    private BigDecimal discountAmount;
    
    @NotNull(message = "QUANTITY_REQUIRED")
    @Min(value = 1, message = "QUANTITY_MIN")
    private Integer quantity;

    @NotNull(message = "START_DATE_REQUIRED")
    private LocalDateTime startDate;

    @NotNull(message = "END_DATE_REQUIRED")
    private LocalDateTime endDate;

    @NotBlank(message = "STATUS_REQUIRED")
    private String status;
}

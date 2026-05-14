package com.example.booking.dto.request;

import java.math.BigDecimal;
import java.util.UUID;

import com.example.booking.entity.Booking;
import com.example.common.enums.PriceType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingItemRequest {

    @NotNull(message = "PRICE_TYPE_REQUIRED")
    private PriceType priceType;

    @NotNull(message = "QUANTITY_REQUIRED")
    @Min(value = 1, message = "QUANTITY_MIN")
    private Integer quantity;

    @NotNull(message = "UNIT_PRICE_REQUIRED")
    @DecimalMin(value = "0.0", inclusive = false, message = "UNIT_PRICE_MIN")
    private BigDecimal unitPrice;
}

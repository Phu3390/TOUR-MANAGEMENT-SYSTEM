package com.example.tours.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;

import com.example.common.enums.PriceType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourPriceRequest {
    @NotNull(message = "PRICE_REQUIRED")
    @DecimalMin(value = "0.0", inclusive = false, message = "PRICE_MIN")
    private BigDecimal price;

    @NotNull(message = "PRICE_TYPE_REQUIRED")
    private PriceType priceType;

}

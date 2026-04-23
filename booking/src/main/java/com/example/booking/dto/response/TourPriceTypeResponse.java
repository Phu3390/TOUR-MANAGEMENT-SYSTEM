package com.example.booking.dto.response;

import java.math.BigDecimal;

import com.example.common.enums.PriceType;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TourPriceTypeResponse {
    BigDecimal price;
    PriceType priceType;
}

package com.example.booking.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

import com.example.booking.entity.Booking;
import com.example.common.enums.PriceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingItemResponse {
    
    private UUID id;
    private UUID booking;
    private PriceType priceType;
    private Integer quantity;
    private BigDecimal unitPrice;
}

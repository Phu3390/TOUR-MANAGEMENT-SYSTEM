package com.example.booking.dto.request;

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
public class BookingItemRequest {

    // private UUID booking_id;
    private PriceType priceType; 
    private Integer quantity;
    private BigDecimal unitPrice;
}

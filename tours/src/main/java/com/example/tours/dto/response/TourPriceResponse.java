package com.example.tours.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.example.common.enums.PriceType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourPriceResponse {
    
    private UUID id;
    
    private TourDetailResponse tourDetail;
    
    private BigDecimal price;
    
    private PriceType priceType;
    
    private LocalDateTime createdAt;
}

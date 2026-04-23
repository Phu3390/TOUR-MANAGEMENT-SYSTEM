package com.example.common.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class TourQueryRequest extends BaseQueryRequest {

    private String location;
    private String duration;
    private Double minRating;
    private Double maxRating;

    private BigDecimal minPrice;
    private BigDecimal maxPrice;
}

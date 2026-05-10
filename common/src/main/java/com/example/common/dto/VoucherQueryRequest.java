package com.example.common.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class VoucherQueryRequest extends BaseQueryRequest {
       // filter chính xác
    private String code;
    private String status;

    // discount percent
    private Integer minDiscountPercent;
    private Integer maxDiscountPercent;

    // discount amount
    private BigDecimal minDiscountAmount;
    private BigDecimal maxDiscountAmount;

    // quantity
    private Integer minQuantity;
    private Integer maxQuantity;

    // start date
    private LocalDateTime startDateFrom;
    private LocalDateTime startDateTo;

    // end date
    private LocalDateTime endDateFrom;
    private LocalDateTime endDateTo;

    // created at
    private LocalDateTime createdAtFrom;
    private LocalDateTime createdAtTo;
}

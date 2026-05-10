package com.example.common.dto;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.example.common.dto.BaseQueryRequest;
import com.example.common.enums.BookingStatus;
import com.example.common.enums.PaymentMethod;
import com.example.common.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class BookingQueryRequest extends BaseQueryRequest {
    private UUID userId;
    private UUID tourId;
    private UUID tourDetailId;
    private BookingStatus bookingStatus;
    private PaymentStatus paymentStatus;
    private PaymentMethod paymentMethod;
    private String voucherCode;
    private BigDecimal minTotalPrice;
    private BigDecimal maxTotalPrice;
    private LocalDateTime createdFrom;
    private LocalDateTime createdTo;
    private LocalDateTime expiredFrom;
    private LocalDateTime expiredTo;
    private Boolean expiredOnly;
}

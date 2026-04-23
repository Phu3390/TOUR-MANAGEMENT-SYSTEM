package com.example.booking.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.example.common.enums.BookingStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    // private UUID userId;
    private UUID tourId;
    private UUID tourDetailId;

    private String contactFullname;
    private String contactEmail;
    private String contactPhone;
    private String contactAddress;
    
    private BigDecimal totalPrice;
    private BookingStatus status;

    private String note;
}

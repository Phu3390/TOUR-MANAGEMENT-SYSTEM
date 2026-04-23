package com.example.booking.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
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
public class BookingResponse {
    
    private UUID id;

    private UUID userId;
    private UUID tourId;
    private UUID tourDetailId;

    private String contactFullname;
    private String contactEmail;
    private String contactPhone;
    private String contactAddress;

    private BigDecimal totalPrice;
    private BookingStatus status;
    private String note;

    private LocalDateTime expiredAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<BookingItemResponse> items;
    private List<PaymentResponse> payments;
    private List<BookingVoucherResponse> bookingVouchers;
}

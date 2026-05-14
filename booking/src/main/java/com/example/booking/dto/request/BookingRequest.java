package com.example.booking.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.example.common.enums.BookingStatus;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    @NotNull(message = "TOUR_ID_REQUIRED")
    private UUID tourId;

    @NotNull(message = "TOUR_DETAIL_ID_REQUIRED")
    private UUID tourDetailId;

    @NotBlank(message = "CONTACT_FULLNAME_REQUIRED")
    private String contactFullname;

    @NotBlank(message = "CONTACT_EMAIL_REQUIRED")
    @Email(message = "EMAIL_INVALID")
    private String contactEmail;

    @NotBlank(message = "CONTACT_PHONE_REQUIRED")
    private String contactPhone;

    @NotBlank(message = "CONTACT_ADDRESS_REQUIRED")
    private String contactAddress;

    @NotNull(message = "TOTAL_PRICE_REQUIRED")
    @DecimalMin(value = "0.0", inclusive = false, message = "TOTAL_PRICE_MIN")
    private BigDecimal totalPrice;

    @NotNull(message = "STATUS_REQUIRED")
    private BookingStatus status;

    private String note;
}

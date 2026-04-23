package com.example.booking.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.booking.validator.voucher.VoucherActive;
import com.example.booking.validator.voucher.VoucherExists;
import com.example.booking.validator.voucher.VoucherHasQuantity;
import com.example.booking.validator.voucher.VoucherNotExpired;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherRequest {

    // @VoucherExists(message = "Voucher code does not exist")
    // @VoucherActive
    // @VoucherNotExpired
    // @VoucherHasQuantity
    private String code;
    private Integer discountPercent;
    private BigDecimal discountAmount;
    private Integer quantity;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
}

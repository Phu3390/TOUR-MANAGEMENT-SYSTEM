package com.example.booking.validator.voucher;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.booking.repository.VoucherRepository;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

@Component
public class VoucherDateValidator implements ConstraintValidator<VoucherNotExpired, String> {

    @Autowired
    private VoucherRepository repo;

    @Override
    public boolean isValid(String code, ConstraintValidatorContext context) {
        if (code == null || code.isBlank()) return true;

        return repo.findByCode(code).map(v -> {
            LocalDateTime now = LocalDateTime.now();
            return !now.isBefore(v.getStartDate()) && !now.isAfter(v.getEndDate());
        }).orElse(true);
    }
}

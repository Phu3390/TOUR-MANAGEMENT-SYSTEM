package com.example.booking.validator.voucher;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.booking.repository.VoucherRepository;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

@Component
public class VoucherQuantityValidator implements ConstraintValidator<VoucherHasQuantity, String> {

    @Autowired
    private VoucherRepository repo;

    @Override
    public boolean isValid(String code, ConstraintValidatorContext context) {
        if (code == null || code.isBlank()) return true;

        return repo.findByCode(code)
                .map(v -> v.getQuantity() > 0)
                .orElse(true);
    }
}
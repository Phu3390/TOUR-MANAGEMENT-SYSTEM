package com.example.booking.validator.voucher;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.booking.repository.VoucherRepository;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

@Component
public class VoucherActiveValidator implements ConstraintValidator<VoucherActive, String> {

    @Autowired
    private VoucherRepository repo;

    @Override
    public boolean isValid(String code, ConstraintValidatorContext context) {
        if (code == null || code.isBlank())
            return true;

        return repo.findByCode(code)
                .map(v -> "ACTIVE".equals(v.getStatus()))
                .orElse(true); // để cái Exists xử lý
    }
}
package com.example.booking.validator.voucher;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.booking.repository.VoucherRepository;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

@Component
public class VoucherExistsValidator implements ConstraintValidator<VoucherExists, String> {

    @Autowired
    private VoucherRepository repo;

    @Override
    public boolean isValid(String code, ConstraintValidatorContext context) {
        if (code == null || code.isBlank())
            return true; // để @NotBlank xử lý
        return repo.findByCode(code).isPresent();
    }
}
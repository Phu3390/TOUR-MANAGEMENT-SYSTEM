package com.example.booking.validator.voucher;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = VoucherActiveValidator.class)
public @interface VoucherActive {
    String message() default "Voucher không hoạt động";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

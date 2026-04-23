package com.example.booking.validator.voucher;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = VoucherDateValidator.class)
public @interface VoucherNotExpired {
    String message() default "Voucher đã hết hạn hoặc chưa bắt đầu";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

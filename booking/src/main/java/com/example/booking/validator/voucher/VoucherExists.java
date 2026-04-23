package com.example.booking.validator.voucher;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target({ ElementType.FIELD, ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = VoucherExistsValidator.class)
@Documented
public @interface VoucherExists {
     String message();

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}

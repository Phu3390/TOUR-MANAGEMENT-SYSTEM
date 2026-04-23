package com.example.booking.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.booking.dto.request.PaymentRequest;
import com.example.booking.dto.response.PaymentResponse;
import com.example.booking.entity.Payment;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    @Mapping(target = "booking", ignore = true)
    Payment toEntity(PaymentRequest request);

    @Mapping(target = "booking", ignore = true)
    PaymentResponse toResponse(Payment payment);

    List<PaymentResponse> toResponseList(List<Payment> payments);

    void updateEntityFromRequest(PaymentRequest request, @MappingTarget Payment entity);
}

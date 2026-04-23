package com.example.booking.controller;

import java.util.UUID;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.booking.dto.request.PaymentRequest;
import com.example.booking.dto.response.PaymentResponse;
import com.example.booking.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;
    
    @PostMapping("{id}")
    public PaymentResponse createPayment(@PathVariable UUID bookingId, @RequestBody PaymentRequest request) {
        return paymentService.create(bookingId, request);
    }
}

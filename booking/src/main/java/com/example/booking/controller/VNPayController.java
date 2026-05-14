package com.example.booking.controller;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.booking.dto.request.VnPayRequest;
import com.example.booking.dto.response.VnPayResponse;
import com.example.booking.service.VNPayService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings/vnpay")
@RequiredArgsConstructor
public class VNPayController {
    private final VNPayService vnPayService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping("/create")
    public ResponseEntity<VnPayResponse> createPayment(
            @Valid @RequestBody VnPayRequest req,
            HttpServletRequest request) {
        String paymentUrl = vnPayService.createPaymentUrl(req, request);
        return ResponseEntity.ok(VnPayResponse.builder().url(paymentUrl).message("PENDING").build());
    }
    
    @GetMapping("/vnpay-return")
    public ResponseEntity<?> paymentReturn(HttpServletRequest request) throws IOException{
        return vnPayService.paymentReturn(request);
    }
}

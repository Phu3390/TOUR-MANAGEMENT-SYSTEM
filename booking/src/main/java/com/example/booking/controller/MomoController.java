package com.example.booking.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.booking.dto.request.MomoRequest;
import com.example.booking.dto.response.MomoResponse;
import com.example.booking.service.MomoService;

@RestController
@RequestMapping("/api/bookings/momo")
@RequiredArgsConstructor
public class MomoController {

    private final MomoService momoService;

    @PostMapping("/create")
    public ResponseEntity<MomoResponse> createPayment(
            @RequestBody MomoRequest request,
            HttpServletRequest httpRequest) {

        return ResponseEntity.ok(
                momoService.createPaymentUrl(request, httpRequest));
    }
    @GetMapping("/return")
    public ResponseEntity<?> paymentReturn(
            HttpServletRequest request) throws IOException {

        return momoService.paymentReturn(request);
    }
}
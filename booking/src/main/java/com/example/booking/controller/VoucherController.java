package com.example.booking.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.booking.dto.request.VoucherRequest;
import com.example.booking.dto.response.VoucherResponse;
import com.example.booking.entity.Voucher;
import com.example.booking.service.VoucherService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings/voucher")
@RequiredArgsConstructor
public class VoucherController {
    private final VoucherService voucherService;

    @GetMapping
    public List<VoucherResponse> getAllVouchers() {
        return voucherService.getAllVouchers();
    }

    @GetMapping("/{code}")
    public VoucherResponse getVoucherByCode(@PathVariable String code) {
        return voucherService.getVoucherByCode(code);
    }

    @PostMapping
    public VoucherResponse create(@RequestBody VoucherRequest req) {
        return voucherService.create(req);
    }

    @PutMapping("/{id}")
    public VoucherResponse update(@PathVariable UUID id, @RequestBody VoucherRequest req) {
        return voucherService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void stop(@PathVariable UUID id) {
        voucherService.stop(id);
    }
}

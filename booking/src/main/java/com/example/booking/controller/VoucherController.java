package com.example.booking.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.booking.dto.request.VoucherRequest;
import com.example.booking.dto.response.BookingResponse;
import com.example.booking.dto.response.VoucherResponse;
import com.example.booking.entity.Voucher;
import com.example.booking.service.VoucherService;
import com.example.common.dto.BookingQueryRequest;
import com.example.common.dto.PageResponse;
import com.example.common.dto.VoucherQueryRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings/voucher")
@RequiredArgsConstructor
public class VoucherController {
    private final VoucherService voucherService;

    @GetMapping("/filter")
    public PageResponse<VoucherResponse> getFilter(@ModelAttribute("req") VoucherQueryRequest req) {
        return voucherService.filter(req);
    }

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

    @PutMapping("/status/{id}")
    public void editStatus(@PathVariable UUID id, @RequestBody String status) {
        voucherService.editStatus(id, status);
    }
}

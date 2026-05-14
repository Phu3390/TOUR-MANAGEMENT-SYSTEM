package com.example.tours.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.tours.dto.request.TourDetailRequest;
import com.example.tours.dto.response.TourDetailResponse;
import com.example.tours.service.TourDetailService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tours/tourdetail")
@RequiredArgsConstructor
public class TourDetailController {
    private final TourDetailService service;

    @GetMapping
    public List<TourDetailResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public List<TourDetailResponse> getById(@PathVariable UUID id) {
        return service.getById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}")
    public List<TourDetailResponse> createList(@PathVariable UUID id, @Valid@RequestBody List<TourDetailRequest> requests) {
        return service.createList(id, requests);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/detail/{id}")
    public TourDetailResponse createOne(@PathVariable UUID id, @Valid @RequestBody TourDetailRequest request) {
        return service.createOne(id, request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public TourDetailResponse updateOne(@PathVariable UUID id, @Valid @RequestBody TourDetailRequest request) {
        return service.updateOne(id, request);
    }

    @PreAuthorize("hasRole('SystemToken')")
    @PutMapping("/updatestock/{id}")
    public void updateStock(@PathVariable UUID id, @RequestBody Integer quantity) {
        service.updateStock(id, quantity);
    }

    @PreAuthorize("hasRole('SystemToken')")
    @PutMapping("/updaterollbackstock/{id}")
    public void updateRollBackStock(@PathVariable UUID id, @RequestBody Integer quantity) {
        service.updateRollBackStock(id, quantity);
    }
    
}

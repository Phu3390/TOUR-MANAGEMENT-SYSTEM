package com.example.tours.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.tours.dto.request.TourPriceRequest;
import com.example.tours.dto.response.TourPriceResponse;
import com.example.tours.service.TourPriceService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/tours/tourprice")
@RequiredArgsConstructor
public class TourPriceController {
    private final TourPriceService tourPriceService;

    @GetMapping
    public List<TourPriceResponse> getAll() {
        return tourPriceService.getAll();
    }

    @GetMapping("/{tourDetailId}")
    public List<TourPriceResponse> getByTourDetailId(@PathVariable UUID tourDetailId) {
        return tourPriceService.getByTourDetailId(tourDetailId);
    }

    @PostMapping("/{tourDetailId}")
    public List<TourPriceResponse> createList(@PathVariable UUID tourDetailId, @RequestBody List<TourPriceRequest> requests) {
        return tourPriceService.createList(tourDetailId, requests);
    }

    @PostMapping("/price/{tourDetailId}")
    public TourPriceResponse createOne(@PathVariable UUID tourDetailId, @RequestBody TourPriceRequest request) {
        return tourPriceService.createOne(tourDetailId, request);
    }

    @PutMapping("/{id}")
    public TourPriceResponse updateOne(@PathVariable UUID id, @RequestBody TourPriceRequest request) {
        return tourPriceService.updateOne(id, request);
    }

    @GetMapping("/price/{tourDetailId}")
    public List<TourPriceResponse> getPrice(@PathVariable UUID tourDetailId) {
        return tourPriceService.getPrice(tourDetailId);
    }

}

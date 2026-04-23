package com.example.tours.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.tours.dto.request.TourItineraryRequest;
import com.example.tours.dto.response.TourItineraryResponse;
import com.example.tours.service.TourItineraryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tours/touritinerary")
@RequiredArgsConstructor
public class TourItineraryController {
    private final TourItineraryService tourItineraryService;

    @GetMapping
    public List<TourItineraryResponse> getAll() {
        return tourItineraryService.getAll();
    }

    @GetMapping("/{tourDetailId}")
    public List<TourItineraryResponse> getByIdTourDetailId(@PathVariable UUID tourDetailId) {
        return tourItineraryService.getByTourDetailId(tourDetailId);
    }

    @PostMapping("/{tourDetailId}")
    public List<TourItineraryResponse> createList(@PathVariable UUID tourDetailId, @RequestBody List<TourItineraryRequest> request) {
        return tourItineraryService.createList(tourDetailId, request);
    }

    @PostMapping("/itinerary/{tourDetailId}")
    public TourItineraryResponse createOne(@PathVariable UUID tourDetailId, @RequestBody TourItineraryRequest request) {
        return tourItineraryService.createOne(tourDetailId, request);
    }

    @PutMapping("/{id}")
    public TourItineraryResponse updateOne(@PathVariable UUID id, @RequestBody TourItineraryRequest request) {
        return tourItineraryService.updateOne(id, request);
    }
}

package com.example.tours.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.common.dto.PageResponse;
import com.example.common.dto.TourQueryRequest;
import com.example.tours.dto.request.CreateTourRequest;
import com.example.tours.dto.request.TourRequest;
import com.example.tours.dto.response.TourResponse;
import com.example.tours.service.TourService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/tours/tour")
@RequiredArgsConstructor
public class TourController {
    private final TourService tourService;

    @GetMapping("/filter")
    public PageResponse<TourResponse> getFiltered(@ModelAttribute("req") TourQueryRequest req) {
        return tourService.getFiltered(req);
    }


    @GetMapping
    public List<TourResponse> getAll() {
        return tourService.getAll();
    }

    @GetMapping("/{id}")
    public TourResponse getById(@PathVariable UUID id) {
        return tourService.getById(id);
    }

    @PostMapping
    public TourResponse createFullTour(@RequestBody CreateTourRequest req) {
        return tourService.createFullTour(req);
    }

    @PutMapping("/{id}")
    public TourResponse update(@PathVariable UUID id, @RequestBody TourRequest request) {        
        return tourService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        tourService.delete(id);
    }

}

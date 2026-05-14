package com.example.tours.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.common.dto.PageResponse;
import com.example.common.dto.ReviewQueryRequest;
import com.example.common.dto.TourQueryRequest;
import com.example.tours.dto.request.ReviewRequest;
import com.example.tours.dto.response.ReviewResponse;
import com.example.tours.dto.response.TourResponse;
import com.example.tours.service.ReviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tours/review")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping("/filter")
    public PageResponse<ReviewResponse> getFiltered(@ModelAttribute("req") ReviewQueryRequest req) {
        return reviewService.filter(req);
    }
    
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/me")
    public List<ReviewResponse> getByUserId() {
        return reviewService.getByUserId();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping("/{tourId}")
    public ReviewResponse createReview(@PathVariable UUID tourId, @Valid @RequestBody ReviewRequest review) {
        return reviewService.create(tourId, review);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PutMapping("/{reviewId}")
    public ReviewResponse updateReview(@PathVariable UUID reviewId, @Valid @RequestBody ReviewRequest review) {
        return reviewService.update(reviewId, review);
    }
}

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

import com.example.tours.dto.request.ReviewRequest;
import com.example.tours.dto.response.ReviewResponse;
import com.example.tours.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tours/review")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping("/{tourId}")
    public List<ReviewResponse> getByTourId(@PathVariable UUID tourId) {
        return reviewService.getReviewsByTourId(tourId);
    }

    @GetMapping("/me")
    public List<ReviewResponse> getByUserId() {
        return reviewService.getByUserId();
    }

    @PostMapping("/{tourId}")
    public ReviewResponse createReview(@PathVariable UUID tourId, @RequestBody ReviewRequest review) {
        return reviewService.create(tourId, review);
    }

    @PutMapping("/{reviewId}")
    public ReviewResponse updateReview(@PathVariable UUID reviewId, @RequestBody ReviewRequest review) {
        return reviewService.update(reviewId, review);
    }
}

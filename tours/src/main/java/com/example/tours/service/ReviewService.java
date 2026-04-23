package com.example.tours.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;

import com.example.tours.dto.request.ReviewRequest;
import com.example.tours.dto.response.ReviewResponse;
import com.example.tours.entity.Review;
import com.example.tours.entity.Tour;
import com.example.tours.helper.SecurityUtils;
import com.example.tours.mapper.ReviewMapper;
import com.example.tours.repository.ReviewRepository;
import com.example.tours.repository.TourRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class ReviewService {
    ReviewRepository repository;
    ReviewMapper mapper;

    // AuthClient authClient;

    TourRepository tourRepository;

    public List<ReviewResponse> getReviewsByTourId(UUID tourId) {
        return mapper.toListResponse(repository.findByTourId(tourId));
    }

    public List<ReviewResponse> getByUserId() {
        UUID user_id = UUID.fromString(SecurityUtils.getNameClaim("userId"));
        return mapper.toListResponse(repository.findByUserId(user_id));
    }

    @Transactional
    public ReviewResponse create(UUID tourId, ReviewRequest request) {
        Review review = mapper.toEntity(request);
        UUID user_id = UUID.fromString(SecurityUtils.getNameClaim("userId"));
        String fullName = SecurityUtils.getNameClaim("fullName");
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new AppException(ErrorCode.Tour_NOT_FOUND));
        if (repository.existsByUserIdAndTourId(user_id, tourId)) {
            throw new AppException(ErrorCode.DUPLICATE_REVIEW);
        }
        review.setUserId(user_id);
        review.setReviewerName(fullName);
        review.setTour(tour);
        return mapper.toResponse(repository.save(review));
    }

    @Transactional
    public ReviewResponse update(UUID reviewId, ReviewRequest request) {
        Review review = repository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.Review_NOT_FOUND));
        UUID user_id = UUID.fromString(SecurityUtils.getNameClaim("userId"));

        if (!review.getUserId().equals(user_id)) {
            throw new AppException(ErrorCode.DUPLICATE_REVIEW_NOT_FOUND);
        }

        mapper.updateEntityFromRequest(request, review);
        return mapper.toResponse(repository.save(review));
    }

}

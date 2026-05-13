package com.example.tours.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.common.dto.PageResponse;
import com.example.common.dto.ReviewQueryRequest;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.PageableUtil;
import com.example.common.utils.SpecificationBuilder;
import com.example.tours.client.BookingClient;
import com.example.tours.dto.request.ReviewRequest;
import com.example.tours.dto.request.isValidBookingRequest;
import com.example.tours.dto.response.ReviewResponse;
import com.example.tours.dto.response.isValidBookingResponse;
import com.example.tours.entity.Review;
import com.example.tours.entity.Tour;
import com.example.tours.helper.SecurityUtils;
import com.example.tours.mapper.ReviewMapper;
import com.example.tours.repository.ReviewRepository;
import com.example.tours.repository.TourRepository;
import org.springframework.data.domain.Page;
import jakarta.persistence.criteria.Predicate;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class ReviewService {
    ReviewRepository repository;
    ReviewMapper mapper;

    BookingClient bookingClient;

    TourRepository tourRepository;

    public List<ReviewResponse> getReviewsByTourId(UUID tourId) {
        return mapper.toListResponse(repository.findByTourId(tourId));
    }

    public PageResponse<ReviewResponse> filter(ReviewQueryRequest req) {

        Pageable pageable = PageableUtil.build(req);

        Specification<Review> specification = (root, query, cb) -> {

            SpecificationBuilder<Review> builder = new SpecificationBuilder<>();

            builder.keyword(
                    root,
                    cb,
                    req.getKeyword(),
                    "reviewerName",
                    "content");

            if (req.getReviewerName() != null && !req.getReviewerName().trim().isEmpty()) {
                builder.equal(
                        root,
                        cb,
                        "reviewerName",
                        req.getReviewerName());
            }

            // filter tourId
            if (req.getTourId() != null && !req.getTourId().isEmpty()) {
                builder.joinEqual(
                        root,
                        cb,
                        "tour", 
                        "id",
                        UUID.fromString(req.getTourId()));
            }
            // filter userId
            if (req.getUserId() != null && !req.getUserId().isEmpty()) {
                builder.equal(
                        root,
                        cb,
                        "userId",
                        UUID.fromString(req.getUserId()));
            }

            // rating range
            builder.ge(root, cb, "rating", req.getMinRating());
            builder.le(root, cb, "rating", req.getMaxRating());

            Predicate predicate = builder.build(cb);

            query.orderBy(cb.desc(root.get("createdAt")));

            return predicate;
        };

        Page<Review> page = repository.findAll(specification, pageable);

        return PageResponse.<ReviewResponse>builder()
                .content(
                        page.getContent()
                                .stream()
                                .map(mapper::toResponse)
                                .toList())
                .pageNumber(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .sizeCurrent(page.getNumberOfElements())
                .build();
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
        isValidBookingRequest isvalidreq = new isValidBookingRequest();
        isvalidreq.setTourId(tourId);
        isvalidreq.setUserId(user_id);
        isValidBookingResponse ivalid = bookingClient.isvalid(isvalidreq).getData();
        if (!ivalid.isValid()) {
            throw new AppException(ErrorCode.INVALID_REVIEW);
        }
        review.setUserId(user_id);
        review.setReviewerName(fullName);
        review.setTour(tour);
        updateRatingAverage(tourId);
        return mapper.toResponse(repository.save(review));
    }

    public void updateRatingAverage(UUID tourId) {

        List<Review> reviews = repository.findByTourId(tourId);
        int totalReviews = reviews.size();
        double average = reviews.stream()
                .filter(review -> review.getRating() != null) 
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new AppException(ErrorCode.Tour_NOT_FOUND));
        double roundedAverage = Math.round(average * 10.0) / 10.0;
        tour.setRating(roundedAverage);
        tour.setTotalReviews(totalReviews);
        tourRepository.save(tour);
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

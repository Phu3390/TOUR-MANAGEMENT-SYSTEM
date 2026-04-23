package com.example.tours.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.common.dto.PageResponse;
import com.example.common.dto.TourQueryRequest;
import com.example.common.enums.TourStatus;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.mapper.PageMapper;
import com.example.common.utils.PageableUtil;
import com.example.tours.dto.request.CreateTourRequest;
import com.example.tours.dto.request.TourDetailRequest;
import com.example.tours.dto.request.TourRequest;
import com.example.tours.dto.response.TourResponse;
import com.example.tours.entity.Tour;
import com.example.tours.entity.TourDetail;
import com.example.tours.entity.TourPrice;
import com.example.tours.mapper.TourDetailMapper;
import com.example.tours.mapper.TourMapper;
import com.example.tours.repository.TourDetailRepository;
import com.example.tours.repository.TourRepository;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class TourService {
    TourRepository tourRepository;
    TourMapper tourMapper;
    TourDetailMapper tourDetailMapper;
    TourDetailRepository tourDetailRepository;
    TourPriceService tourPriceService;
    TourItineraryService tourItineraryService;

    public List<TourResponse> getAll() {
        return tourMapper.toList(tourRepository.findAll());
    }

    public TourResponse getById(UUID id) {
        Tour tour = tourRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.Tour_NOT_FOUND));
        return tourMapper.toResponse(tour);
    }

    public PageResponse<TourResponse> getFiltered(TourQueryRequest req) {
        Pageable pageable = PageableUtil.build(req);

        Specification<Tour> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 🔍 keyword
            if (req.getKeyword() != null && !req.getKeyword().isBlank()) {
                String like = "%" + req.getKeyword().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), like),
                        cb.like(cb.lower(root.get("shortDesc")), like),
                        cb.like(cb.lower(root.get("longDesc")), like)));
            }

            // 📍 location
            if (req.getLocation() != null && !req.getLocation().isBlank()) {
                predicates.add(cb.equal(root.get("location"), req.getLocation()));
            }

            // ⏱ duration
            if (req.getDuration() != null && !req.getDuration().isBlank()) {
                predicates.add(cb.equal(root.get("duration"), req.getDuration()));
            }

            // ⭐ rating
            if (req.getMinRating() != null) {
                predicates.add(cb.greaterThanOrEqualTo(
                        root.get("rating"), req.getMinRating()));
            }

            if (req.getMaxRating() != null) {
                predicates.add(cb.lessThanOrEqualTo(
                        root.get("rating"), req.getMaxRating()));
            }

            // 💰 price (join)
            Join<Tour, TourDetail> detailJoin = null;
            Join<TourDetail, TourPrice> priceJoin = null;

            if (req.getMinPrice() != null || req.getMaxPrice() != null) {
                detailJoin = root.join("tourDetails", JoinType.LEFT);
                priceJoin = detailJoin.join("tourPrices", JoinType.LEFT);

                if (req.getMinPrice() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(
                            priceJoin.get("price"), req.getMinPrice()));
                }

                if (req.getMaxPrice() != null) {
                    predicates.add(cb.lessThanOrEqualTo(
                            priceJoin.get("price"), req.getMaxPrice()));
                }

                query.distinct(true);
            }

            // 🔒 status
            // predicates.add(cb.equal(root.get("status"), TourStatus.ACTIVE));

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Tour> pageData = tourRepository.findAll(spec, pageable);

        return PageMapper.toPageResponse(
                pageData.map(tourMapper::toResponse));
    }

    @Transactional
    public TourResponse createFullTour(CreateTourRequest request) {
        Tour tour = create(request.getTour());

        List<TourDetail> details = new ArrayList<>();
        if (request.getTourDetails() != null) {
            for (TourDetailRequest detailReq : request.getTourDetails()) {
                TourDetail detail = tourDetailMapper.toEntity(detailReq);
                detail.setTour(tour);

                if (detailReq.getCapacity() < detailReq.getRemainingSeats()) {
                    throw new AppException(ErrorCode.CAPACITY_MUST_BE_GREATER_THAN_REMAINING_SEATS);
                }

                if (detailReq.getEndDay().isBefore(detailReq.getStartDay())) {
                    throw new AppException(ErrorCode.INVALID_END_DAY);
                }

                detail = tourDetailRepository.save(detail);

                if (detailReq.getPrices() != null) {
                    tourPriceService.createList(detail.getId(), detailReq.getPrices());
                }

                if (detailReq.getItineraries() != null) {
                    tourItineraryService.createList(detail.getId(), detailReq.getItineraries());
                }

                details.add(detail);
            }
        }
        tour.setTourDetails(details);
        return tourMapper.toResponse(tour);
    }

    public Tour create(TourRequest request) {
        Tour tour = tourMapper.toEntity(request);
        if (tourRepository.existsBySlug(tour.getSlug())) {
            throw new AppException(ErrorCode.SLUG_ALREADY_EXISTS);
        }
        return tourRepository.save(tour);
    }

    public TourResponse update(UUID id, TourRequest request) {
        Tour tour = tourRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.Tour_NOT_FOUND));
        tourMapper.updateEntity(tour, request);
        if (tourRepository.existsBySlugAndIdNot(tour.getSlug(), tour.getId())) {
            throw new AppException(ErrorCode.SLUG_ALREADY_EXISTS);
        }
        return tourMapper.toResponse(tourRepository.save(tour));
    }

    public void delete(UUID id) {
        Tour tour = tourRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.Tour_NOT_FOUND));
        tour.setStatus(TourStatus.INACTIVE);
        tourRepository.save(tour);
    }

}

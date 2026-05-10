package com.example.booking.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.booking.client.TourClient;
import com.example.booking.dto.response.BookingResponse;
import com.example.booking.entity.Booking;
import com.example.booking.mapper.BookingMapper;
import com.example.booking.repository.BookingRepository;
import com.example.common.dto.BookingQueryRequest;
import com.example.common.dto.PageResponse;
import com.example.common.utils.PageableUtil;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingPageService {
    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;
    private final TourClient tourClient;

    public PageResponse<BookingResponse> getAllBookings(BookingQueryRequest req) {

        Pageable pageable = PageableUtil.build(req);

        Specification<Booking> specification = (root, query, cb) -> {

            query.distinct(true);

            Predicate predicate = cb.conjunction();

            // ===== Keyword =====
            if (req.getKeyword() != null && !req.getKeyword().trim().isEmpty()) {

                String keyword = "%" + req.getKeyword().trim().toLowerCase() + "%";

                Predicate byName = cb.like(
                        cb.lower(root.get("contactFullname")),
                        keyword);

                Predicate byEmail = cb.like(
                        cb.lower(root.get("contactEmail")),
                        keyword);

                Predicate byPhone = cb.like(
                        cb.lower(root.get("contactPhone")),
                        keyword);

                predicate = cb.and(
                        predicate,
                        cb.or(byName, byEmail, byPhone));
            }

            // ===== Booking =====
            if (req.getUserId() != null) {
                predicate = cb.and(
                        predicate,
                        cb.equal(root.get("userId"), req.getUserId()));
            }

            if (req.getTourId() != null) {
                predicate = cb.and(
                        predicate,
                        cb.equal(root.get("tourId"), req.getTourId()));
            }

            if (req.getTourDetailId() != null) {
                predicate = cb.and(
                        predicate,
                        cb.equal(root.get("tourDetailId"), req.getTourDetailId()));
            }

            if (req.getBookingStatus() != null) {
                predicate = cb.and(
                        predicate,
                        cb.equal(root.get("status"), req.getBookingStatus()));
            }

            // ===== Price =====
            if (req.getMinTotalPrice() != null) {
                predicate = cb.and(
                        predicate,
                        cb.greaterThanOrEqualTo(
                                root.get("totalPrice"),
                                req.getMinTotalPrice()));
            }

            if (req.getMaxTotalPrice() != null) {
                predicate = cb.and(
                        predicate,
                        cb.lessThanOrEqualTo(
                                root.get("totalPrice"),
                                req.getMaxTotalPrice()));
            }

            // ===== Created =====
            if (req.getCreatedFrom() != null) {
                predicate = cb.and(
                        predicate,
                        cb.greaterThanOrEqualTo(
                                root.get("createdAt"),
                                req.getCreatedFrom()));
            }

            if (req.getCreatedTo() != null) {
                predicate = cb.and(
                        predicate,
                        cb.lessThanOrEqualTo(
                                root.get("createdAt"),
                                req.getCreatedTo()));
            }

            // ===== Expired =====
            if (req.getExpiredFrom() != null) {
                predicate = cb.and(
                        predicate,
                        cb.greaterThanOrEqualTo(
                                root.get("expiredAt"),
                                req.getExpiredFrom()));
            }

            if (req.getExpiredTo() != null) {
                predicate = cb.and(
                        predicate,
                        cb.lessThanOrEqualTo(
                                root.get("expiredAt"),
                                req.getExpiredTo()));
            }

            if (Boolean.TRUE.equals(req.getExpiredOnly())) {
                predicate = cb.and(
                        predicate,
                        cb.lessThan(
                                root.get("expiredAt"),
                                LocalDateTime.now()));
            }

            // ===== Payment =====
            if (req.getPaymentStatus() != null || req.getPaymentMethod() != null) {

                Join<Object, Object> paymentJoin = root.join("payments", JoinType.LEFT);

                if (req.getPaymentStatus() != null) {
                    predicate = cb.and(
                            predicate,
                            cb.equal(
                                    paymentJoin.get("status"),
                                    req.getPaymentStatus()));
                }

                if (req.getPaymentMethod() != null) {
                    predicate = cb.and(
                            predicate,
                            cb.equal(
                                    paymentJoin.get("method"),
                                    req.getPaymentMethod()));
                }
            }

            // ===== Voucher =====
            if (req.getVoucherCode() != null &&
                    !req.getVoucherCode().trim().isEmpty()) {

                Join<Object, Object> bookingVoucherJoin = root.join("bookingVouchers", JoinType.LEFT);

                Join<Object, Object> voucherJoin = bookingVoucherJoin.join("voucher", JoinType.LEFT);

                predicate = cb.and(
                        predicate,
                        cb.equal(
                                cb.lower(voucherJoin.get("code")),
                                req.getVoucherCode().trim().toLowerCase()));
            }

            return predicate;
        };

        Page<Booking> page = bookingRepository.findAll(specification, pageable);
          List<BookingResponse> content = page.getContent().stream()
            .map(booking -> {

                BookingResponse response = bookingMapper.toResponse(booking);

                try {
                    String tourName = tourClient
                            .getTourTitle(booking.getTourId())
                            .getData();

                    response.setTourName(tourName);

                } catch (Exception e) {
                    response.setTourName(null);
                }

                return response;
            })
            .toList();

        return PageResponse.<BookingResponse>builder()
                .pageNumber(page.getNumber())
                .size(page.getSize())
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements())
                .content(content)
                .build();
    }

    // public BookingResponse getBookingDetail(UUID bookingId) {
    //     Booking booking = bookingRepository.findById(bookingId)
    //             .orElseThrow(() -> new RuntimeException("Booking not found"));

    //     return bookingMapper.toResponse(booking);
    // }
}

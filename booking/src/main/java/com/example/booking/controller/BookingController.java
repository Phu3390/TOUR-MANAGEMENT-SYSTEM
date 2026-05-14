package com.example.booking.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.booking.dto.request.CreateBookingRequest;
import com.example.booking.dto.request.isValidBookingRequest;
import com.example.booking.dto.response.BookingResponse;
import com.example.booking.dto.response.TourPriceTypeResponse;
import com.example.booking.dto.response.isValidBookingResponse;
import com.example.booking.service.BookingPageService;
import com.example.booking.service.BookingService;
import com.example.common.dto.BookingQueryRequest;
import com.example.common.dto.PageResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/bookings/booking")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;
    private final BookingPageService bookingPageService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/filter")
    public PageResponse<BookingResponse> getFilter(@ModelAttribute("req") BookingQueryRequest req) {
        return bookingPageService.getAllBookings(req);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("/me")
    public List<BookingResponse> getMe() {
        return bookingService.getBookingByMe();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{userId}")
    public List<BookingResponse> getByUserId(@PathVariable UUID userId) {
        return bookingService.getBookingByUser(userId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/bookingId/{bookingId}")
    public BookingResponse getBookingById(@PathVariable UUID bookingId) {
        return bookingService.getBookingById(bookingId);
    }

    @GetMapping("/price/{tourDetailId}")
    public List<TourPriceTypeResponse> getTourPriceTypes(@PathVariable UUID tourDetailId) {
        return bookingService.getTourPriceTypes(tourDetailId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/confirm/{bookingId}")
    public BookingResponse confirmBooking(@PathVariable UUID bookingId) {
        return bookingService.confirmBooking(bookingId);
    }

    // @PostMapping("/verify/{paymentId}")
    // public BookingResponse verifyPayment(@PathVariable UUID paymentId) {
    // return bookingService.verifyPayment(paymentId);
    // }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/cancel/{paymentId}")
    public void cancelBooking(@PathVariable UUID paymentId) {
        bookingService.cancelBooking(paymentId);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping
    public BookingResponse createBooking(@Valid @RequestBody CreateBookingRequest request) {
        return bookingService.createBooking(request);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping("/isvalid")
    public isValidBookingResponse isValidBooking(@RequestBody isValidBookingRequest req) {
        return bookingService.isValidBooking(req);
    }
}

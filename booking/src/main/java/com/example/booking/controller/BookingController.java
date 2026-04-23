package com.example.booking.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.booking.dto.request.CreateBookingRequest;
import com.example.booking.dto.response.BookingResponse;
import com.example.booking.dto.response.TourPriceTypeResponse;
import com.example.booking.service.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/bookings/booking")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @GetMapping("/me")
    public List<BookingResponse> getMe() {
        return bookingService.getBookingByMe();
    }

    @GetMapping("/{userId}")
    public List<BookingResponse> getByUserId(@PathVariable UUID userId) {
        return bookingService.getBookingByUser(userId);
    }

    @GetMapping("/bookingId/{bookingId}")
    public BookingResponse getBookingById(@PathVariable UUID bookingId) {
        return bookingService.getBookingById(bookingId);
    }

    @GetMapping("/price/{tourDetailId}")
    public List<TourPriceTypeResponse> getTourPriceTypes(@PathVariable UUID tourDetailId) {
        return bookingService.getTourPriceTypes(tourDetailId);
    }

    @PostMapping
    public BookingResponse createBooking(@RequestBody @Valid CreateBookingRequest request) {
        return bookingService.createBooking(request);
    }

}

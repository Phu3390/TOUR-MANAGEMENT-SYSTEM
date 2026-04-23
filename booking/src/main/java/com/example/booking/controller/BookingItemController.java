package com.example.booking.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.booking.dto.response.BookingItemResponse;
import com.example.booking.service.BookingItemService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings/bookingitem")
@RequiredArgsConstructor
public class BookingItemController {
    private final BookingItemService bookingItemService;

    @GetMapping("/{bookingId}")
    public List<BookingItemResponse> getByBookingId(@PathVariable UUID bookingId) {
        return bookingItemService.getByBookingId(bookingId);
    }
    
}

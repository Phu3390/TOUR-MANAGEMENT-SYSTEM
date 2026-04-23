package com.example.booking.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.booking.client.TourClient;
import com.example.booking.dto.request.BookingItemRequest;
import com.example.booking.dto.response.BookingItemResponse;
import com.example.booking.dto.response.TourPriceTypeResponse;
import com.example.booking.entity.Booking;
import com.example.booking.entity.BookingItem;
import com.example.booking.mapper.BookingItemMapper;
import com.example.booking.repository.BookingItemRepository;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class BookingItemService {
    BookingItemRepository bookingItemRepository;
    BookingItemMapper bookingItemMapper;

    public List<BookingItem> createItems(List<BookingItemRequest> items, Booking booking) {

        return items.stream()
                .map(item -> {
                    BookingItem entity = bookingItemMapper.toEntity(item);
                    entity.setBooking(booking);
                    return entity;
                })
                .toList();
    }

    public List<BookingItemResponse> getByBookingId(UUID bookingId) {
        return bookingItemRepository.findByBookingId(bookingId).stream()
                .map(bookingItemMapper::toResponse)
                .toList();
    }
}

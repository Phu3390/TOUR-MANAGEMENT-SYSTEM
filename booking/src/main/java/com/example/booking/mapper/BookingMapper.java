package com.example.booking.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.example.booking.dto.request.BookingRequest;
import com.example.booking.dto.response.BookingResponse;
import com.example.booking.entity.Booking;

@Mapper(componentModel = "spring", uses = { BookingItemMapper.class, PaymentMapper.class, BookingVoucherMapper.class })
public interface BookingMapper {

    Booking toEntity(BookingRequest request);

    BookingResponse toResponse(Booking booking);

    List<BookingResponse> toResponseList(List<Booking> bookings);

    void updateEntityFromRequest(BookingRequest request, @MappingTarget Booking entity);
}

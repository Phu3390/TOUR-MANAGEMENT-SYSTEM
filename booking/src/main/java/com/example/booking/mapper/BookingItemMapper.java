package com.example.booking.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.booking.dto.request.BookingItemRequest;
import com.example.booking.dto.response.BookingItemResponse;
import com.example.booking.entity.BookingItem;

@Mapper(componentModel = "spring",uses = {BookingMapper.class})
public interface BookingItemMapper {
    
    @Mapping(target = "booking", ignore = true)
    BookingItem toEntity(BookingItemRequest request);

    // List<BookingItem> toEntityList(List<BookingItemRequest> requests);

    @Mapping(target = "booking", source = "booking.id")
    BookingItemResponse toResponse(BookingItem item);

    List<BookingItemResponse> toResponseList(List<BookingItem> items);

    void updateEntityFromRequest(BookingItemRequest request, @MappingTarget BookingItem entity);
}

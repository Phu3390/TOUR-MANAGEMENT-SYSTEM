package com.example.tours.mapper;

 
import com.example.tours.dto.request.TourItineraryRequest;
import com.example.tours.dto.response.TourItineraryResponse;
import com.example.tours.entity.TourItinerary;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TourItineraryMapper {
    
    @Mapping(target = "tourDetail", ignore = true)
    TourItinerary toEntity(TourItineraryRequest request);

    @Mapping(target = "tourDetail", ignore = true)
    TourItineraryResponse toResponse(TourItinerary entity);

    List<TourItineraryResponse> toResponseList(List<TourItinerary> entities);

    void updateEntityFromRequest(TourItineraryRequest request, @MappingTarget TourItinerary entity);
}

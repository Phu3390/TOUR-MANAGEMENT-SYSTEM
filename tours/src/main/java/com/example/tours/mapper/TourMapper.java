package com.example.tours.mapper;


import com.example.tours.dto.request.TourRequest;
import com.example.tours.dto.response.TourResponse;
import com.example.tours.entity.Tour;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = TourDetailMapper.class)
public interface TourMapper {

    @Mapping(target = "tourDetails", ignore = true)
    Tour toEntity(TourRequest request);

    TourResponse toResponse(Tour entity);

    List<TourResponse> toList(List<Tour> entities);

    void updateEntity(@MappingTarget Tour tour, TourRequest request);
}

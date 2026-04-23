package com.example.tours.mapper;


import com.example.tours.dto.request.TourPriceRequest;
import com.example.tours.dto.response.TourPriceResponse;
import com.example.tours.entity.TourPrice;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TourPriceMapper {
    
    @Mapping(target = "tourDetail", ignore = true)
    TourPrice toEntity(TourPriceRequest request);

    @Mapping(target = "tourDetail", ignore = true)
    TourPriceResponse toResponse(TourPrice entity);

    List<TourPriceResponse> toResponseList(List<TourPrice> entities);

    void updateEntityFromRequest(TourPriceRequest request, @MappingTarget TourPrice entity);    
}

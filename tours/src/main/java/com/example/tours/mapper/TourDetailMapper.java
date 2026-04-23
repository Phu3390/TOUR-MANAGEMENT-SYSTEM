package com.example.tours.mapper;

import com.example.tours.dto.request.TourDetailRequest;
import com.example.tours.dto.response.TourDetailResponse;
import com.example.tours.entity.TourDetail;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = { TourPriceMapper.class, TourItineraryMapper.class })
public interface TourDetailMapper {

    @Mapping(target = "tour", ignore = true)
    @Mapping(target = "tourPrices", ignore = true)
    @Mapping(target = "tourItineraries", ignore = true)
    TourDetail toEntity(TourDetailRequest request);

    @Mapping(target = "tour", ignore = true)
    TourDetailResponse toResponse(TourDetail entity);

    List<TourDetailResponse> toResponseList(List<TourDetail> entities);

    void updateEntity(@MappingTarget TourDetail tourDetail, TourDetailRequest request);
}

package com.example.tours.mapper;

import com.example.tours.dto.request.ReviewRequest;
import com.example.tours.dto.response.ReviewResponse;
import com.example.tours.entity.Review;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = TourMapper.class)
public interface ReviewMapper {

    @Mapping(target = "tour", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "reviewerName", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Review toEntity(ReviewRequest request);

    ReviewResponse toResponse(Review entity);

    List<ReviewResponse> toListResponse(List<Review> entities);

    void updateEntityFromRequest(ReviewRequest request, @MappingTarget Review entity);
}

package com.example.tours.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

import com.example.common.enums.TourStatus;
import com.example.common.enums.TourType;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourRequest {

    @NotBlank(message = "TITLE_REQUIRED")
    private String title;

    @NotBlank(message = "SLUG_REQUIRED")
    private String slug;

    @NotBlank(message = "LOCATION_REQUIRED")
    private String location;

    @NotBlank(message = "DURATION_REQUIRED")
    private String duration;

    private String shortDesc;

    private String longDesc;

    private String imageUrl;

    private List<String> gallery;

    @Min(value = 0, message = "RATING_MIN")
    @Max(value = 5, message = "RATING_MAX")
    private Double rating = 0.0;

    @Min(value = 0, message = "TOTAL_REVIEWS_MIN")
    private Integer totalReviews = 0;

    @NotNull(message = "TOUR_TYPE_REQUIRED")
    private TourType tourType;

    @NotNull(message = "STATUS_REQUIRED")
    private TourStatus status = TourStatus.ACTIVE;
}

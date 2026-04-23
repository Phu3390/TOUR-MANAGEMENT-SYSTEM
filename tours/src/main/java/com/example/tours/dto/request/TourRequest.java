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
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Slug is required")
    private String slug;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @NotNull(message = "Duration is required")
    private String duration;
    
    private String shortDesc;
    
    private String longDesc;
    
    private String imageUrl;
    
    private List<String> gallery;
    
    @Min(value = 0, message = "Rating must be between 0 and 5")
    @Max(value = 5, message = "Rating must be between 0 and 5")
    private Double rating=0.0;
    
    @Min(value = 0, message = "Total reviews cannot be negative")
    private Integer totalReviews=0;
    
    @NotNull(message = "Tour type is required")
    private TourType tourType;
    
    @NotNull(message = "Status is required")
    private TourStatus status = TourStatus.ACTIVE;
}

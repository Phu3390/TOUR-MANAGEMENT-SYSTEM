package com.example.tours.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.example.common.enums.TourStatus;
import com.example.common.enums.TourType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourResponse {
    
    private UUID id;
    
    private String title;
    
    private String slug;
    
    private String location;
    
    private String duration;
    
    private String shortDesc;
    
    private String longDesc;
    
    private String imageUrl;
    
    private List<String> gallery;
    
    private Double rating;
    
    private Integer totalReviews;
    
    private TourType tourType;
    
    private TourStatus status;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private List<TourDetailResponse> tourDetails;

    // private List<ReviewResponse> reviews;
}

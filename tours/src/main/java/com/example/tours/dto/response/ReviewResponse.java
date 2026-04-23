package com.example.tours.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

import com.example.tours.entity.Tour;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    
    private UUID id;
    
    private TourResponse tour;
    
    private UUID userId;
    
    private String reviewerName;
    
    private Integer rating;
    
    private String content;
    
    private LocalDateTime createdAt;
}

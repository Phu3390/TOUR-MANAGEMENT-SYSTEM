package com.example.tours.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.example.common.enums.TourDetailStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourDetailResponse {
    
    private UUID id;
    
    private TourResponse tour;

    private List<TourPriceResponse> tourPrices;

    private List<TourItineraryResponse> tourItineraries;
    
    private Integer capacity;
    
    private Integer remainingSeats;
    
    private LocalDate startDay;
    
    private LocalDate endDay;
    
    private String startLocation;
    
    private TourDetailStatus status;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}

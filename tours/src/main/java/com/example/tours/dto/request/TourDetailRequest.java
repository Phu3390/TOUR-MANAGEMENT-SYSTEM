package com.example.tours.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.example.common.enums.TourDetailStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourDetailRequest {

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @NotNull(message = "Remaining seats is required")
    @Min(value = 0, message = "Remaining seats cannot be negative")
    private Integer remainingSeats;

    @NotNull(message = "Start date is required")
    private LocalDate startDay;

    @NotNull(message = "End date is required")
    private LocalDate endDay;

    private String startLocation;

    @NotNull(message = "Status is required")
    private TourDetailStatus status;

    private List<TourPriceRequest> prices;
    private List<TourItineraryRequest> itineraries;

}

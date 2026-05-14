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

    @NotNull(message = "CAPACITY_REQUIRED")
    @Min(value = 1, message = "CAPACITY_MIN")
    private Integer capacity;

    @NotNull(message = "REMAINING_SEATS_REQUIRED")
    @Min(value = 0, message = "REMAINING_SEATS_MIN")
    private Integer remainingSeats;

    @NotNull(message = "START_DAY_REQUIRED")
    private LocalDate startDay;

    @NotNull(message = "END_DAY_REQUIRED")
    private LocalDate endDay;

    @NotNull(message = "START_LOCATION_REQUIRED")
    private String startLocation;

    @NotNull(message = "STATUS_REQUIRED")
    private TourDetailStatus status;

    private List<TourPriceRequest> prices;
    private List<TourItineraryRequest> itineraries;
}

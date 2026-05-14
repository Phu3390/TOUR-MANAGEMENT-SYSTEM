package com.example.tours.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourItineraryRequest {

    @NotNull(message = "DAY_NUMBER_REQUIRED")
    @Min(value = 1, message = "DAY_NUMBER_MIN")
    private Integer dayNumber;

    @NotBlank(message = "TITLE_REQUIRED")
    private String title;

    @NotBlank(message = "CONTENT_ITINERARY_REQUIRED")
    private String content;
}

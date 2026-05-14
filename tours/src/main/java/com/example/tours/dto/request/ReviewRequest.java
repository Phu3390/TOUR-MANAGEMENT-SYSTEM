package com.example.tours.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {

    @NotNull(message = "RATING_REQUIRED")
    @Min(value = 1, message = "RATING_MIN")
    @Max(value = 5, message = "RATING_MAX")
    private Integer rating;

    @NotBlank(message = "CONTENT_REQUIRED")
    private String content;

    private String imageUrl;
}

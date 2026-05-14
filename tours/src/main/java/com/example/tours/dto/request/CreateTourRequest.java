package com.example.tours.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTourRequest {
    @Valid
    private TourRequest tour;

    @Valid
    private List<TourDetailRequest> tourDetails;
}

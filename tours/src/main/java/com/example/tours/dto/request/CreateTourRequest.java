package com.example.tours.dto.request;


import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTourRequest {
    private TourRequest tour;
    private List<TourDetailRequest> tourDetails;
}

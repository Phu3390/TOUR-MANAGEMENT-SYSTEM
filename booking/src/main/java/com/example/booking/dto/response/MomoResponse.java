package com.example.booking.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MomoResponse {
    private String url;
    private String message;
}

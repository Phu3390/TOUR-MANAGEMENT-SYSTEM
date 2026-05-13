package com.example.tours.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.common.dto.ApiResponse;
import com.example.tours.dto.request.isValidBookingRequest;
import com.example.tours.dto.response.isValidBookingResponse;

@FeignClient(name = "BOOKING")
public interface BookingClient {
    
    @PostMapping("/api/bookings/booking/isvalid")
    ApiResponse<isValidBookingResponse> isvalid(@RequestBody isValidBookingRequest request);
}

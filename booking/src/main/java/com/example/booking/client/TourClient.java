package com.example.booking.client;

import java.util.List;
import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.example.common.dto.ApiResponse;
import com.example.booking.dto.request.IntrospectRequest;
import com.example.booking.dto.response.IntrospectResponse;
import com.example.booking.dto.response.TourPriceTypeResponse;
import com.example.booking.dto.response.UserResponse;

@FeignClient(name = "TOURS")
public interface TourClient {    
    @PostMapping("/api/auth/introspect")
    ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request);

    @GetMapping("/api/auth/user/me")
    ApiResponse<UserResponse> getMe();

    @GetMapping("api/tours/tourprice/price/{tourDetailId}")
    ApiResponse<List<TourPriceTypeResponse>> getTourPriceType(@PathVariable UUID tourDetailId);

    @PutMapping("/api/tours/tourdetail/updatestock/{id}")
    void updateStock(@PathVariable UUID id, @RequestBody Integer quantity, @RequestHeader("Authorization") String token);

    @PutMapping("/api/tours/tourdetail/updaterollbackstock/{id}")
    void updateRollBackStock(@PathVariable UUID id, @RequestBody Integer quantity, @RequestHeader("Authorization") String token);
}

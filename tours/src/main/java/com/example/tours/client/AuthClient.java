// package com.example.tours.client;

// import org.springframework.cloud.openfeign.FeignClient;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;

// import com.example.common.dto.ApiResponse;
// import com.example.tours.dto.request.IntrospectRequest;
// import com.example.tours.dto.response.IntrospectResponse;
// import com.example.tours.dto.response.UserResponse;

// @FeignClient(name = "AUTH")
// public interface AuthClient {
    
//     @PostMapping("/api/auth/introspect")
//     ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request);

//     @GetMapping("/api/auth/user/me")
//     ApiResponse<UserResponse> getMe();
// }

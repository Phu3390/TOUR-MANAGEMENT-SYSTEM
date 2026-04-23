package com.example.auth.controller;

import java.text.ParseException;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.auth.dto.request.Auth.IntrospectRequset;
import com.example.auth.dto.request.Auth.LoginRequest;
import com.example.auth.dto.request.Auth.SignupRequest;
import com.example.auth.dto.response.Auth.AuthResponse;
import com.example.auth.dto.response.Auth.IntrospectResponse;
import com.example.auth.service.Auth.AuthService;
import com.nimbusds.jose.JOSEException;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/signup")
    public AuthResponse signup(@RequestBody SignupRequest request) throws JOSEException, ParseException {
        return authService.signup(request);
    }

    @PostMapping("/introspect")
    public IntrospectResponse introspect(@RequestBody IntrospectRequset request) throws JOSEException, ParseException {
        return authService.introspect(request);
    }

    // @PostMapping("/logout")
    // public void logout(@RequestBody LogOutRequest request) throws JOSEException, ParseException {
    //     authService.logout(request);
    // }

}

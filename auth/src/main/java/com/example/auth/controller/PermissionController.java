package com.example.auth.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.auth.dto.response.PermissionResponse;
import com.example.auth.service.PermissionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth/permission")
@RequiredArgsConstructor
public class PermissionController {
    private final PermissionService permissionService;

    @GetMapping
    public List<PermissionResponse> getAll() {
        return permissionService.getAll();
    }
}

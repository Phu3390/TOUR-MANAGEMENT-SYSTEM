package com.example.auth.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.auth.dto.response.RoleResponse;
import com.example.auth.service.RoleService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth/role")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<RoleResponse> getAll() {
        return roleService.getAll();
    }
}

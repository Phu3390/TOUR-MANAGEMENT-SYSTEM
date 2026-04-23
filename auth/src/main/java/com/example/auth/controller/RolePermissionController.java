package com.example.auth.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.auth.dto.request.RoleAndRolePermissionRequest;
import com.example.auth.dto.request.RolePermissionRequest;
import com.example.auth.dto.response.RolePermissionResponse;
import com.example.auth.service.RolePermissionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth/rolepermission")
@RequiredArgsConstructor
public class RolePermissionController {
    private final RolePermissionService rolePermissionService;

    @GetMapping("/{id}")
    public List<RolePermissionResponse> getByRoleId(@PathVariable UUID id) {
        return rolePermissionService.getById(id);
    }

    @PostMapping
    public List<RolePermissionResponse> create(
            @RequestBody RoleAndRolePermissionRequest rolePermissionRequests) {
        return rolePermissionService.create(rolePermissionRequests);
    }

    @PutMapping("/{id}")
    public List<RolePermissionResponse> update(@PathVariable UUID id,
            @RequestBody RoleAndRolePermissionRequest rolePermissionRequests) {
        return rolePermissionService.update(rolePermissionRequests, id);
    }
}

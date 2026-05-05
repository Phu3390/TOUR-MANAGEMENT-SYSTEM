package com.example.auth.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.auth.dto.request.RoleRequest;
import com.example.auth.dto.response.PageRoleResponse;
import com.example.auth.dto.response.RoleResponse;
import com.example.auth.service.RoleService;
import com.example.common.dto.PageResponse;
import com.example.common.dto.RoleQueryRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth/role")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @GetMapping("/filter")
    public PageResponse<PageRoleResponse> getFiltered(@ModelAttribute("req") RoleQueryRequest req) {
        return roleService.getFiltered(req);
    }

    @GetMapping
    public List<RoleResponse> getAll() {
        return roleService.getAll();
    }

    @PostMapping
    public RoleResponse create(@RequestBody RoleRequest request) {
        return roleService.create(request);
    }

    @PutMapping("/{id}")
    public RoleResponse update(@PathVariable UUID id, @RequestBody RoleRequest request) {
        return roleService.update(id, request);
    }

    @DeleteMapping("/lock/{id}")
    public void lock(@PathVariable UUID id) {
        roleService.lock(id);
    }

    @DeleteMapping("/unlock/{id}")
    public void unLock(@PathVariable UUID id) {
        roleService.unLock(id);
    }

    @GetMapping("/{id}")
    public RoleResponse getById(@PathVariable UUID id) {
        return roleService.getById(id);
    }
}

package com.example.auth.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.auth.dto.request.UserRequest;
import com.example.auth.dto.response.UserResponse;
import com.example.auth.service.UserService;
import com.example.common.dto.BaseQueryRequest;
import com.example.common.dto.PageResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserService userService;

    // @PreAuthorize("hasRole('user_view')")
    @GetMapping
    public List<UserResponse> getAll() {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        log.info("User: {}", auth.getName());
        log.info("Roles: {}", auth.getAuthorities());
        return userService.getAll();
    }

    @GetMapping("/filter")
    public PageResponse<UserResponse> getFiltered(@ModelAttribute("req") BaseQueryRequest req) {
        return userService.getFiltered(req);
    }

    @GetMapping("/{id}")
    public UserResponse getById(@PathVariable UUID id) {
        return userService.getById(id);
    }

    @GetMapping("/me")
    public UserResponse getMe() {
        return userService.getMe();
    }

    @PostMapping
    public UserResponse create(@RequestBody UserRequest request) {
        return userService.create(request);
    }

    @PutMapping("/{id}")
    public UserResponse update(@PathVariable UUID id, @RequestBody UserRequest request) {
        return userService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        userService.delete(id);
    }
}

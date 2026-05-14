package com.example.auth.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.example.auth.dto.response.RoleResponse;
import com.example.common.enums.Status;
import com.example.auth.mapper.RoleMapper;
import com.example.auth.repository.RoleRepository;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepository roleRepository;
    RoleMapper roleMapper;

    public List<RoleResponse> getAll() {
        return roleMapper.tolList(roleRepository.findByStatus(Status.ACTIVE));
    }
}

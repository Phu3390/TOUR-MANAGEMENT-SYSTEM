package com.example.auth.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.auth.dto.response.PermissionResponse;
import com.example.common.enums.Status;
import com.example.auth.mapper.PermissionMapper;
import com.example.auth.repository.PermissionRepository;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class PermissionService {
    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;

    
    public List<PermissionResponse> getAll(){
        return permissionMapper.toList(permissionRepository.findByStatus(Status.ACTIVE));
    }
}

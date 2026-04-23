package com.example.auth.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.auth.dto.request.RoleAndRolePermissionRequest;
import com.example.auth.dto.request.RolePermissionRequest;
import com.example.auth.dto.request.RoleRequest;
import com.example.auth.dto.response.RolePermissionResponse;
import com.example.auth.dto.response.RoleResponse;
import com.example.auth.entity.Permission;
import com.example.auth.entity.Role;
import com.example.auth.entity.RolePermission;
import com.example.auth.mapper.PermissionMapper;
import com.example.auth.mapper.RoleMapper;
import com.example.auth.mapper.RolePermissionMapper;
import com.example.auth.repository.PermissionRepository;
import com.example.auth.repository.RolePermissionRepository;
import com.example.auth.repository.RoleRepository;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class RolePermissionService {
    RolePermissionMapper rolePermissionMapper;
    RolePermissionRepository rolePermissionRepository;
    
    PermissionRepository permissionRepository;
    
    RoleRepository roleRepository;
    RoleService roleService;
    RoleMapper roleMapper;

    public List<RolePermissionResponse> getById(UUID id) {
        return rolePermissionMapper.toResponseList(rolePermissionRepository.findByRole_Id(id));
    }

    @Transactional
    public List<RolePermissionResponse> create(RoleAndRolePermissionRequest requests) {
        RoleRequest roleRequest = requests.getRole();
        RoleResponse roleResponse = roleService.create(roleRequest);
        Role role = roleMapper.toEntityResponse(roleResponse);

        List<RolePermissionRequest> request = requests.getRole_permissions();
        List<RolePermission> rolePermissionList = new ArrayList<>();

        for (RolePermissionRequest rolePermissionRequest : request) {
            RolePermission rolePermission = rolePermissionMapper.toEntity(rolePermissionRequest);
            Permission permission = permissionRepository.findById(rolePermissionRequest.getPermission_id())
                    .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_EXITS));
            rolePermission.setPermission(permission);
            rolePermission.setRole(role);
            rolePermissionList.add(rolePermission);
        }
        return rolePermissionMapper.toResponseList(rolePermissionRepository.saveAll(rolePermissionList));
    }

    @Transactional
    public List<RolePermissionResponse> update(RoleAndRolePermissionRequest requests, UUID roleId) {


        Role role = roleRepository.findById(roleId).orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXITS));
        rolePermissionRepository.deleteByRole_Id(roleId);

        List<RolePermissionRequest> request = requests.getRole_permissions();

        List<RolePermission> rolePermissionList = new ArrayList<>();

        for (RolePermissionRequest rolePermissionRequest : request) {
            RolePermission rolePermission = rolePermissionMapper.toEntity(rolePermissionRequest);
            Permission permission = permissionRepository.findById(rolePermissionRequest.getPermission_id())
                    .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_EXITS));
            rolePermission.setPermission(permission);
            rolePermission.setRole(role);
            rolePermissionList.add(rolePermission);
        }

        return rolePermissionMapper.toResponseList(rolePermissionRepository.saveAll(rolePermissionList));

    }
}

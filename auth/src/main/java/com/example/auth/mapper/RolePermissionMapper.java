package com.example.auth.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.example.auth.dto.request.RolePermissionRequest;
import com.example.auth.dto.response.RolePermissionResponse;
import com.example.auth.entity.RolePermission;

@Mapper(componentModel = "spring")  
public interface RolePermissionMapper {
    RolePermission toEntity(RolePermissionRequest request);

    List<RolePermission> toEntityList(List<RolePermissionRequest> request);

    RolePermissionResponse toResponse(RolePermission entity);

    List<RolePermissionResponse> toResponseList(List<RolePermission> entity);

    void updateEntity(@MappingTarget RolePermission entity, RolePermissionRequest request);
}

package com.example.auth.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.example.auth.dto.request.RoleRequest;
import com.example.auth.dto.response.RoleResponse;
import com.example.auth.entity.Role;

@Mapper(componentModel = "spring")  
public interface RoleMapper {
    Role toEntity(RoleRequest request);

    RoleResponse toResponse(Role entity);

    List<RoleResponse> tolList(List<Role> entity);

    Role toEntityResponse(RoleResponse response);

    void updateEntity(@MappingTarget Role entity, RoleRequest request);
}

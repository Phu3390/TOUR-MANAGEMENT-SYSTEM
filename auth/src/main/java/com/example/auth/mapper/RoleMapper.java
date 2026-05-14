package com.example.auth.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.example.auth.dto.response.RoleResponse;
import com.example.auth.entity.Role;

@Mapper(componentModel = "spring")  
public interface RoleMapper {

    RoleResponse toResponse(Role entity);

    List<RoleResponse> tolList(List<Role> entity);

    Role toEntityResponse(RoleResponse response);
}

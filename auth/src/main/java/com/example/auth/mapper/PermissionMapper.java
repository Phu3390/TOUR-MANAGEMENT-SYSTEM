package com.example.auth.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.example.auth.dto.response.PermissionResponse;
import com.example.auth.entity.Permission;

@Mapper(componentModel = "spring")  
public interface PermissionMapper {
    
    PermissionResponse toResponse(Permission entity);

     List<PermissionResponse> toList(List<Permission> entity);

}

package com.example.auth.dto.response;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.example.auth.entity.Role;
import com.example.auth.entity.RolePermission;
import com.example.common.enums.Status;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleResponse {
    UUID id;
    String name;
    Status status;
    List<RolePermission> rolePermissions;
}

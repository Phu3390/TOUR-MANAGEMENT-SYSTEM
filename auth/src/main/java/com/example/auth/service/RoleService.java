package com.example.auth.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.auth.dto.request.RoleRequest;
import com.example.auth.dto.response.PageRoleResponse;
import com.example.auth.dto.response.RoleResponse;
import com.example.auth.dto.response.UserResponse;
import com.example.auth.entity.Role;
import com.example.common.dto.BaseQueryRequest;
import com.example.common.dto.PageResponse;
import com.example.common.dto.RoleQueryRequest;
import com.example.common.enums.Status;
import com.example.auth.mapper.RoleMapper;
import com.example.auth.repository.RoleRepository;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.mapper.PageMapper;
import com.example.common.utils.PageableUtil;
import com.example.common.utils.SpecificationBuilder;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepository roleRepository;
    RoleMapper roleMapper;

    public PageResponse<PageRoleResponse> getFiltered(RoleQueryRequest req) {
        Pageable pageable = PageableUtil.build(req);

        Specification<Role> spec = (root, query, cb) -> {
            SpecificationBuilder<Role> builder = new SpecificationBuilder<>();
            builder.keyword(root, cb, req.getKeyword(), "name")
             .equal(root, cb, "status", req.getStatus());

            return builder.build(cb);
        };
        Page<Role> pageData = roleRepository.findAll(spec, pageable);

        return PageMapper.toPageResponse(
                pageData.map(roleMapper::toPageRoleResponse));
    }

    public List<RoleResponse> getAll() {
        return roleMapper.tolList(roleRepository.findByStatus(Status.ACTIVE));
    }

    public RoleResponse create(RoleRequest request) {
        Role role = roleMapper.toEntity(request);
        return roleMapper.toResponse(roleRepository.save(role));
    }

    public RoleResponse update(UUID id, RoleRequest request) {
        Role role = roleRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXITS));
        role.setName(request.getName());
        return roleMapper.toResponse(roleRepository.save(role));
    }

    public void lock(UUID id) {
        Role role = roleRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXITS));
        role.setStatus(Status.INACTIVE);
        roleRepository.save(role);
    }

    public void unLock(UUID id) {
        Role role = roleRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXITS));
        role.setStatus(Status.ACTIVE);
        roleRepository.save(role);
    }

    public RoleResponse getById(UUID id) {
        return roleMapper
                .toResponse(roleRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXITS)));
    }
}

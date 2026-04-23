package com.example.auth.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.auth.dto.request.UserRequest;
import com.example.auth.dto.response.UserResponse;
import com.example.auth.entity.Role;
import com.example.auth.entity.User;
import com.example.common.dto.BaseQueryRequest;
import com.example.common.dto.PageResponse;
import com.example.common.enums.Status;
import com.example.auth.mapper.UserMapper;
import com.example.auth.repository.RoleRepository;
import com.example.auth.repository.UserRepository;
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
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;

    public PageResponse<UserResponse> getFiltered(BaseQueryRequest req) {
                Pageable pageable = PageableUtil.build(req);

                Specification<User> spec = (root, query, cb) -> {
                        SpecificationBuilder<User> builder = new SpecificationBuilder<>();
                        builder.keyword(root, cb, req.getKeyword(), "email","fullName");
                        return cb.and(
                                        builder.build(cb),
                                        cb.equal(root.get("status"), Status.ACTIVE));
                };
                Page<User> pageData = userRepository.findAll(spec, pageable);

                return PageMapper.toPageResponse(
                                pageData.map(userMapper::toResponse));
        }

    public List<UserResponse> getAll() {
        return userMapper.toList(userRepository.findByStatus(Status.ACTIVE));
    }

    public UserResponse getById(UUID id) {
        return userMapper.toResponse(
                userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXITS)));
    }

    public UserResponse getMe() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userMapper.toResponse(
                userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXITS)));
    }

    public UserResponse create(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXITS);
        }
        Role role = roleRepository.findById(request.getRole_id())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXITS));
        User user = userMapper.toEntity(request);
        user.setRole(role);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userMapper.toResponse(userRepository.save(user));
    }

    public UserResponse update(UUID id, UserRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXITS));
        if (userRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
            throw new AppException(ErrorCode.EMAIL_EXITS);
        }
        Role role = roleRepository.findById(request.getRole_id())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXITS));
        userMapper.updateUserEntity(user, request);
        user.setRole(role);
        if(request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userMapper.toResponse(userRepository.save(user));
    }

    public void delete(UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXITS));
        user.setStatus(Status.INACTIVE);
        userRepository.save(user);
    }
}

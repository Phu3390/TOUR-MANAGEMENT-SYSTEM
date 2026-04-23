package com.example.auth.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.auth.dto.request.UserRequest;
import com.example.auth.dto.request.Auth.SignupRequest;
import com.example.auth.dto.response.UserResponse;
import com.example.auth.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toEntity(UserRequest request);

    User toEntitySignup(SignupRequest request);

    UserResponse toResponse(User entity);

    List<UserResponse> toList(List<User> entity);

    @Mapping(target = "password", ignore = true)
    void updateUserEntity(@MappingTarget User entity, UserRequest request);
}

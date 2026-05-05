package com.example.common.dto;

import com.example.common.enums.Status;

import lombok.Data;

@Data
public class UserQueryRequest extends BaseQueryRequest {
    private Status status;
    private String role;
}

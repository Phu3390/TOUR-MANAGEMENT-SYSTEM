package com.example.common.dto;

import com.example.common.enums.Status;

import lombok.Data;

@Data
public class RoleQueryRequest extends BaseQueryRequest {
    private Status status;
}

package com.example.common.dto;

import java.util.Map;

import lombok.Data;

@Data
public class BaseQueryRequest  {

    private String keyword;


    private Integer pageNumber = 0;
    private Integer size = 10;

    private String sortBy = "id";
    private String sortDir = "desc";

    private Map<String, Object> filters;
}

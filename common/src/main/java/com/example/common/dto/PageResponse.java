package com.example.common.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PageResponse<T> {
    private List<T> content;
    private int pageNumber;
    private int size;
    private long totalElements;
    private int totalPages;
    private int sizeCurrent; 
}

package com.example.common.mapper;

import org.springframework.data.domain.Page;

import com.example.common.dto.PageResponse;


public class PageMapper {

    public static <T> PageResponse<T> toPageResponse(Page<T> page) {
        return PageResponse.<T>builder()
                .content(page.getContent())
                .totalPages(page.getTotalPages())
                .pageNumber(page.getNumber())
                .size(page.getSize())
                .sizeCurrent(page.getNumberOfElements())
                .totalElements(page.getTotalElements())
                .build();
    }
}

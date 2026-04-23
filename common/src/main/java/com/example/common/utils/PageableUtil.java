package com.example.common.utils;

import org.springframework.data.domain.Pageable; 
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import com.example.common.dto.BaseQueryRequest;

public class PageableUtil {

    public static Pageable build(BaseQueryRequest req) {
        int size = Math.min(req.getSize(), 50);

        Sort sort = Sort.by(
                Sort.Direction.fromString(req.getSortDir()),
                req.getSortBy()
        );

        return PageRequest.of(req.getPageNumber(), size, sort);
    }
}


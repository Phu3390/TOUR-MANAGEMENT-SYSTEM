package com.example.common.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ReviewQueryRequest extends BaseQueryRequest {

    // lọc theo tour
    private String tourId;

    // lọc theo user
    private String userId;

    // lọc theo tên reviewer
    private String reviewerName;

    // lọc rating
    private Integer minRating;
    private Integer maxRating;
}
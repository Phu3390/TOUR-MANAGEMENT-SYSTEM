package com.example.common.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppException extends RuntimeException {
    private ErrorCode code;

    public AppException(ErrorCode code) {
        super(code.getMessage());
        this.code = code;
    }
}

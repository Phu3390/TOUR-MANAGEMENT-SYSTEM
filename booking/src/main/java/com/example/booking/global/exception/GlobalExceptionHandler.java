package com.example.booking.global.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.example.common.dto.ApiResponse;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;



@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse> handleException(Exception e){
        return ResponseEntity.status(ErrorCode.UNKNOWN_ERROR.getStatus()).body(ApiResponse.builder()
                .code(ErrorCode.UNKNOWN_ERROR.getCode())
                .message(ErrorCode.UNKNOWN_ERROR.getMessage())
                .build());
    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> handleAppException(AppException e) {
        ErrorCode errorCode = e.getCode();
        return ResponseEntity.status(errorCode.getStatus()).body(ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build());
    }

        @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse> handleValidation(MethodArgumentNotValidException e) {

        String enumkey = e.getFieldError().getDefaultMessage();

        ErrorCode errorCode = ErrorCode.IVALID_KEY;
        try {
            errorCode = ErrorCode.valueOf(enumkey);
        } catch (IllegalArgumentException ex) {
            errorCode = ErrorCode.IVALID_KEY;
        }
        ApiResponse response = new ApiResponse();
        response.setCode(errorCode.getCode());
        response.setMessage(errorCode.getMessage());
        return ResponseEntity.status(errorCode.getStatus()).body(response);
    }

    
    @ExceptionHandler(value = AuthorizationDeniedException.class)
    ResponseEntity<ApiResponse> handleAuthorizationDeniedException(AuthorizationDeniedException e) {
        ErrorCode errorCode = ErrorCode.FORBIDDEN;
        return ResponseEntity.status(errorCode.getStatus()).body(ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build());
    }

    

}

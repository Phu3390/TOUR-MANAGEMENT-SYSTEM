package com.example.booking.util;

import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

public class SecurityUtils {
    public static UUID getCurrentUserId() {
         UUID userId = UUID.fromString(
                ((Jwt) SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal())
                        .getClaim("userId"));
        return userId;
    }
    
}

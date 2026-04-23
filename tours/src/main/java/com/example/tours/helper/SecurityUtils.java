package com.example.tours.helper;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

public class SecurityUtils {
    public static String getNameClaim(String claimName) {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext()
        .getAuthentication()
        .getPrincipal();
        String userIdStr = jwt.getClaim(claimName);
        return userIdStr;
    }
}

package com.example.booking.global.Interceptor;

import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import feign.RequestInterceptor;
import feign.RequestTemplate;

@Component
public class FeignAuthInterceptor implements RequestInterceptor {

    @Override
    public void apply(RequestTemplate template) {
        var attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attrs == null) {
            return; 
        }

        var request = attrs.getRequest();
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null) {
            template.header("Authorization", authHeader);
        }
    }
}

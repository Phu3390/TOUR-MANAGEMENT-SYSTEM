package com.example.tours.global.Interceptor;


import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import feign.RequestInterceptor;
import feign.RequestTemplate;

@Component
public class FeignAuthInterceptor implements RequestInterceptor {

    @Override
    public void apply(RequestTemplate template) {
        var request = ((ServletRequestAttributes) RequestContextHolder
                .getRequestAttributes()).getRequest();

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null) {
            template.header("Authorization", authHeader);
        }
    }
}

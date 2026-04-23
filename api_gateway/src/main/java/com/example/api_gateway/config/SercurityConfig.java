package com.example.api_gateway.config;

import java.util.List;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@Configuration
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SercurityConfig {

        private static final String[] PUBLIC_ENDPOINTS = {
                        "/api/auth/login",
                        "/api/auth/signup",
                        "/api/auth/introspect",
                        "/api/tours/tour/**",
        };

        @Value("${jwt.secret}")
        String secret_key;

        @Value("${server.frontend.url}")
        String url_frontend;

        @Bean
        public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {

                return http
                                .cors(Customizer.withDefaults())
                                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                                .authorizeExchange(ex -> ex
                                                .pathMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**")
                                                .permitAll()
                                                .pathMatchers(PUBLIC_ENDPOINTS).permitAll()
                                                .anyExchange().authenticated())
                                .oauth2ResourceServer(oauth2 -> oauth2
                                                .jwt(Customizer.withDefaults()))
                                .build();
        }

        @Bean
        public ReactiveJwtDecoder jwtDecoder() {
                return NimbusReactiveJwtDecoder
                                .withSecretKey(new SecretKeySpec(secret_key.getBytes(), "SHA256"))
                                .build();
        }

        @Bean
        public CorsWebFilter corsWebFilter() {
                CorsConfiguration config = new CorsConfiguration();

                config.setAllowedOrigins(List.of(url_frontend));
                // config.setAllowedMethods(List.of("*"));
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of("*"));
                config.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", config);

                return new CorsWebFilter(source);
        }
}

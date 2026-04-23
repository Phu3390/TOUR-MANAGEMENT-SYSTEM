package com.example.booking.config;

import java.util.Objects;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import com.example.common.dto.ApiResponse;
import com.example.booking.dto.request.IntrospectRequest;
import com.example.booking.dto.response.IntrospectResponse;



@Component
public class CustomeJwtDecoder implements JwtDecoder {

    @Value("${jwt.secret}")
    private String signerkey;

    // @Autowired
    // private AuthClient authClient;

    private NimbusJwtDecoder nimbusJwtDecoder = null;

    @Override
    public Jwt decode(String token) throws JwtException {

        if (token == null || token.isBlank()) {
            throw new JwtException("Token missing");
        }

        // IntrospectRequest request = new IntrospectRequest(token);
        // ApiResponse<IntrospectResponse> res = authClient.introspect(request);

        // if (!res.getData().isAuth()) {
        //     throw new JwtException("Token invalid");
        // }

        if (Objects.isNull(nimbusJwtDecoder)) {
            SecretKeySpec secretKeySpec = new SecretKeySpec(signerkey.getBytes(), "HS256");
            nimbusJwtDecoder = NimbusJwtDecoder
                    .withSecretKey(secretKeySpec)
                    .macAlgorithm(MacAlgorithm.HS256)
                    .build();
        }
        return nimbusJwtDecoder.decode(token);
    }
}

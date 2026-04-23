package com.example.auth.service.Auth;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.auth.dto.request.Auth.IntrospectRequset;
import com.example.auth.dto.request.Auth.LogOutRequest;
import com.example.auth.dto.request.Auth.LoginRequest;
import com.example.auth.dto.request.Auth.SignupRequest;
import com.example.auth.dto.response.Auth.AuthResponse;
import com.example.auth.dto.response.Auth.IntrospectResponse;
import com.example.auth.entity.ListToken;
import com.example.auth.entity.Role;
import com.example.auth.entity.User;
import com.example.common.enums.Status;
import com.example.auth.mapper.UserMapper;
import com.example.auth.repository.ListTokenRepository;
import com.example.auth.repository.RoleRepository;
import com.example.auth.repository.UserRepository;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class AuthService {
    final UserRepository repository;
    final PasswordEncoder passwordEncoder;
    // final ListTokenRepository listTokenRepository;
    final UserMapper userMapper;
    final RoleRepository roleRepository;

    @NonFinal
    @Value("${jwt.secret}")
    String SECRET_KEY;

    @NonFinal
    @Value("${jwt.expiration}")
    int exp;

    public AuthResponse login(LoginRequest request) {
        User user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_PASSWORD_INVALID));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.EMAIL_PASSWORD_INVALID);
        }
        if (user.getStatus().equals(Status.INACTIVE)) {
            throw new AppException(ErrorCode.ACCOUND_BAN);
        }
        return AuthResponse.builder()
                .token(genarateToken(user))
                .authentication(true)
                .build();
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXITS);
        }
        User user = userMapper.toEntitySignup(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        Role role = roleRepository.findByName("USER").orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXITS));
        user.setRole(role);

        User usernew = repository.save(user);
        LoginRequest loginRequest = LoginRequest.builder()
                .email(usernew.getEmail())
                .password(request.getPassword())
                .build();
        return login(loginRequest);
    }

    public IntrospectResponse introspect(IntrospectRequset introspectRequset) throws JOSEException, ParseException {
        var token = introspectRequset.getToken();
        boolean ivaild = true;
        try {
            verifyToken(token);
        } catch (Exception e) {
            ivaild = false;
        }
        return IntrospectResponse.builder()
                .auth(ivaild)
                .build();
    }

    // public void logout(LogOutRequest logOutRequest) throws JOSEException, ParseException {
    //     var signToken = verifyToken(logOutRequest.getToken());
    //     String jit = signToken.getJWTClaimsSet().getJWTID();
    //     java.util.Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

    //     ListToken listToken = ListToken.builder()
    //             .id(jit)
    //             .expiryTime(expiryTime)
    //             .build();

    //     listTokenRepository.save(listToken);
    // }

    public SignedJWT verifyToken(String token) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SECRET_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        java.util.Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!verified && expiryTime.after(new java.util.Date()))
            throw new AppException(ErrorCode.UNAUTHORIZED);
        // if (listTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
        //     throw new AppException(ErrorCode.UNAUTHORIZED);
        return signedJWT;
    }

    public String genarateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer("phudeptrai.com")
                .issueTime(new java.util.Date())
                .expirationTime(new Date(Instant.now().plus(exp, ChronoUnit.HOURS).toEpochMilli()))
                .claim("userId", user.getId())
                .claim("scope", buildScope(user))
                .claim("fullName", user.getFullName())
                .build();
        Payload payload = new Payload(claimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(SECRET_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (Exception e) {
            throw new RuntimeException("Error signing the token", e);
        }
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        Role role = user.getRole();

        if (role != null && role.getRolePermissions() != null) {
            role.getRolePermissions().forEach(ct -> {
                String scope = ct.getPermission().getName() + "_" + ct.getAction();
                stringJoiner.add(scope);
            });
        }
        return stringJoiner.toString();
    }
}

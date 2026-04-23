// package com.example.auth.service.Auth;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Service;

// import com.example.auth.repository.ListTokenRepository;
// import com.nimbusds.jose.JWSVerifier;
// import com.nimbusds.jose.crypto.MACVerifier;
// import com.nimbusds.jwt.SignedJWT;

// import lombok.RequiredArgsConstructor;
// import lombok.experimental.FieldDefaults;

// @Service
// @RequiredArgsConstructor
// @FieldDefaults(level = lombok.AccessLevel.PRIVATE)
// public class TokenService {
//     final ListTokenRepository listTokenRepository;

//      @Value("${jwt.secret}")
//     private String SECRET_KEY;

//     public boolean validate(String token) {
//         try {
//             SignedJWT signedJWT = SignedJWT.parse(token);

//             JWSVerifier verifier = new MACVerifier(SECRET_KEY.getBytes());

//             boolean verified = signedJWT.verify(verifier);

//             var expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

//             if (!verified || expiryTime.before(new java.util.Date())) {
//                 return false;
//             }

//             if (listTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())) {
//                 return false;
//             }

//             return true;

//         } catch (Exception e) {
//             return false;
//         }
//     }
// }

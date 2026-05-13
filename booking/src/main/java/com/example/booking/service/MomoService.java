package com.example.booking.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.booking.config.MomoConfig;
import com.example.booking.dto.request.MomoRequest;
import com.example.booking.dto.response.MomoResponse;

import java.io.IOException;
import java.text.Normalizer;
import java.util.*;

@Service
@RequiredArgsConstructor
public class MomoService {

        private final MomoConfig momoConfig;
        private final BookingService bookingService;
        private final RestTemplate restTemplate;

        @Value("${server.frontend.url}")
        private String frontendUrl;

        public MomoResponse createPaymentUrl(MomoRequest req, HttpServletRequest request) {

                try {
                        String requestId = UUID.randomUUID().toString();
                        String orderId = req.getPaymentId().replace("-", "");
                        String orderInfo = "momopay";
                        String amount = String.valueOf(req.getAmount());

                        String ipnUrl = momoConfig.getReturnUrl();

                        String rawHash = "accessKey=" + momoConfig.getAccessKey() +
                                        "&amount=" + amount +
                                        "&extraData=" +
                                        "&ipnUrl=" + ipnUrl +
                                        "&orderId=" + orderId +
                                        "&orderInfo=" + orderInfo +
                                        "&partnerCode=" + momoConfig.getPartnerCode() +
                                        "&redirectUrl=" + momoConfig.getReturnUrl() +
                                        "&requestId=" + requestId +
                                        "&requestType=captureWallet";

                        String signature = MomoConfig.hmacSHA256(
                                        momoConfig.getSecretKey(),
                                        rawHash);

                        System.out.println("RAW HASH CREATE: " + rawHash);
                        System.out.println("SIGNATURE CREATE: " + signature);

                        Map<String, Object> body = new HashMap<>();
                        body.put("partnerCode", momoConfig.getPartnerCode());
                        body.put("partnerName", "TourBooking");
                        body.put("storeId", "TourBookingStore");
                        body.put("requestId", requestId);
                        body.put("amount", amount);
                        body.put("orderId", orderId);
                        body.put("orderInfo", orderInfo);
                        body.put("redirectUrl", momoConfig.getReturnUrl());
                        body.put("ipnUrl", ipnUrl);
                        body.put("lang", "vi");
                        body.put("requestType", "captureWallet");
                        body.put("autoCapture", true);
                        body.put("extraData", "");
                        body.put("signature", signature);

                        HttpHeaders headers = new HttpHeaders();
                        headers.setContentType(MediaType.APPLICATION_JSON);

                        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

                        ResponseEntity<Map> response = restTemplate.exchange(
                                        momoConfig.getEndpoint(),
                                        HttpMethod.POST,
                                        entity,
                                        Map.class);

                        Map<String, Object> responseBody = response.getBody();

                        System.out.println("MOMO RESPONSE: " + responseBody);

                        return MomoResponse.builder()
                                        .url(responseBody.get("payUrl") != null
                                                        ? responseBody.get("payUrl").toString()
                                                        : null)
                                        .message(responseBody.get("message") != null
                                                        ? responseBody.get("message").toString()
                                                        : "Success")
                                        .build();

                } catch (Exception e) {
                        return MomoResponse.builder()
                                        .url(null)
                                        .message("Create MoMo payment failed: " + e.getMessage())
                                        .build();
                }
        }

        private UUID parsePaymentId(String raw) {

                if (raw == null || raw.length() != 32) {
                        throw new IllegalArgumentException("Invalid paymentId");
                }

                return UUID.fromString(
                                raw.substring(0, 8) + "-" +
                                                raw.substring(8, 12) + "-" +
                                                raw.substring(12, 16) + "-" +
                                                raw.substring(16, 20) + "-" +
                                                raw.substring(20));
        }

        public boolean verifyPayment(HttpServletRequest request) {

                String rawHash = "accessKey=" + momoConfig.getAccessKey() +
                                "&amount=" + defaultString(request.getParameter("amount")) +
                                "&extraData=" + defaultString(request.getParameter("extraData")) +
                                "&message=" + defaultString(request.getParameter("message")) +
                                "&orderId=" + defaultString(request.getParameter("orderId")) +
                                "&orderInfo=" + defaultString(request.getParameter("orderInfo")) +
                                "&orderType=" + defaultString(request.getParameter("orderType")) +
                                "&partnerCode=" + defaultString(request.getParameter("partnerCode")) +
                                "&payType=" + defaultString(request.getParameter("payType")) +
                                "&requestId=" + defaultString(request.getParameter("requestId")) +
                                "&responseTime=" + defaultString(request.getParameter("responseTime")) +
                                "&resultCode=" + defaultString(request.getParameter("resultCode")) +
                                "&transId=" + defaultString(request.getParameter("transId"));

                String localSignature = MomoConfig.hmacSHA256(
                                momoConfig.getSecretKey(),
                                rawHash);

                String momoSignature = request.getParameter("signature");

                System.out.println("RAW HASH VERIFY: " + rawHash);
                System.out.println("LOCAL SIGNATURE: " + localSignature);
                System.out.println("MOMO SIGNATURE: " + momoSignature);

                return localSignature.equalsIgnoreCase(momoSignature)
                                && "0".equals(request.getParameter("resultCode"));
        }

        private String defaultString(String value) {
                return value == null ? "" : value;
        }

        public ResponseEntity<?> paymentReturn(HttpServletRequest request)
                        throws IOException {

                boolean isValid = verifyPayment(request);

                String paymentId = request.getParameter("orderId");
                String transactionCode = request.getParameter("transId");

                if (isValid) {

                        bookingService.verifyPayment(
                                        parsePaymentId(paymentId),
                                        transactionCode);

                        return ResponseEntity.status(HttpStatus.FOUND)
                                        .header("Location",
                                                        frontendUrl + "/client/dashboard?momo=success")
                                        .build();
                }

                return ResponseEntity.status(HttpStatus.FOUND)
                                .header("Location",
                                                frontendUrl + "/client/dashboard?momo=failed")
                                .build();
        }

}
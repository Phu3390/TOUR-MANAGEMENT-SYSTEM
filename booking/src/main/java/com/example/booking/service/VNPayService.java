package com.example.booking.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.booking.config.VNPayConfig;
import com.example.booking.dto.request.VnPayRequest;
import com.example.booking.dto.response.VnPayResponse;
import com.example.booking.entity.Booking;
import com.example.booking.repository.BookingRepository;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;

import java.io.IOException;
import java.text.Normalizer;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VNPayService {

    private final VNPayConfig vnPayConfig;

    private final BookingService bookingService;

    @Value("${server.frontend.url}")
    private String frontendUrl;

    public String createPaymentUrl(VnPayRequest req, HttpServletRequest request) {

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = req.getPaymentId().replace("-", "");
        String vnp_IpAddr = getIpAddress(request);
        String vnp_TmnCode = vnPayConfig.getTmnCode();
        String orderType = "other";

        // VNPay yêu cầu x100
        long vnp_Amount = req.getAmount() * 100;

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");

        String vnp_CreateDate = formatter.format(cld.getTime());

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", vnp_Version);
        vnpParams.put("vnp_Command", vnp_Command);
        vnpParams.put("vnp_TmnCode", vnp_TmnCode);
        vnpParams.put("vnp_Amount", String.valueOf(vnp_Amount));
        vnpParams.put("vnp_CurrCode", "VND");

        // // bankCode optional
        // vnpParams.put("vnp_BankCode", "NCB");

        vnpParams.put("vnp_TxnRef", vnp_TxnRef);

        String orderInfo = normalizeVNPayText(req.getOrderInfo());
        vnpParams.put("vnp_OrderInfo", orderInfo);
        vnpParams.put("vnp_OrderType", orderType);

        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnpParams.put("vnp_IpAddr", vnp_IpAddr);

        vnpParams.put("vnp_CreateDate", vnp_CreateDate);
        vnpParams.put("vnp_ExpireDate", vnp_ExpireDate);

        String queryUrl = VNPayConfig.buildQueryUrl(vnpParams, vnPayConfig.getHashSecret());

        return vnPayConfig.getPayUrl() + "?" + queryUrl;
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

        Map<String, String> fields = new HashMap<>();

        request.getParameterMap().forEach((key, value) -> {
            if (key.startsWith("vnp_")
                    && !key.equals("vnp_SecureHash")
                    && !key.equals("vnp_SecureHashType")) {
                fields.put(key, value[0]);
            }
        });

        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();

        for (int i = 0; i < fieldNames.size(); i++) {

            String fieldName = fieldNames.get(i);
            String fieldValue = fields.get(fieldName);

            if (fieldValue != null && !fieldValue.isEmpty()) {

                hashData.append(fieldName)
                        .append("=")
                        .append(fieldValue);

                if (i < fieldNames.size() - 1) {
                    hashData.append("&");
                }
            }
        }

        String secureHash = request.getParameter("vnp_SecureHash");

        System.out.println("VERIFY HASH DATA: " + hashData);

        String generatedHash = VNPayConfig.hmacSHA512(
                vnPayConfig.getHashSecret(),
                hashData.toString());

        System.out.println("LOCAL HASH: " + generatedHash);
        System.out.println("VNPAY HASH: " + secureHash);

        return generatedHash.equalsIgnoreCase(secureHash)
                && "00".equals(request.getParameter("vnp_ResponseCode"))
                && "00".equals(request.getParameter("vnp_TransactionStatus"));
    }

    private String getIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-FORWARDED-FOR");

        if (ip == null || ip.isEmpty()) {
            ip = request.getRemoteAddr();
        }

        // Convert IPv6 localhost -> IPv4 localhost
        if ("0:0:0:0:0:0:0:1".equals(ip) || "::1".equals(ip)) {
            ip = "127.0.0.1";
        }

        return ip;
    }

    private String normalizeVNPayText(String input) {
        if (input == null)
            return "";

        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);

        return normalized.replaceAll("\\p{M}", "")
                .replaceAll("[^a-zA-Z0-9\\s-]", "")
                .trim();
    }

    public ResponseEntity<?> paymentReturn(HttpServletRequest request) throws IOException {

        boolean isValid = verifyPayment(request);

        String transactionCode = request.getParameter("vnp_TransactionNo");
        String paymentId = request.getParameter("vnp_TxnRef");

        if (isValid) {
            bookingService.verifyPayment(
                    parsePaymentId(paymentId),
                    transactionCode);

            return ResponseEntity.status(HttpStatus.FOUND)
                    .header("Location", frontendUrl + "/client/dashboard?vnpay=success")
                    .build();
        }

        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", frontendUrl + "/client/dashboard?vnpay=failed")
                .build();
    }

}
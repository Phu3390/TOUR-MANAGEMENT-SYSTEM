package com.example.booking.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.booking.dto.request.PaymentRequest;
import com.example.booking.dto.response.PaymentResponse;
import com.example.booking.entity.Booking;
import com.example.booking.entity.Payment;
import com.example.booking.mapper.PaymentMapper;
import com.example.booking.repository.BookingRepository;
import com.example.booking.repository.PaymentRepository;
import com.example.common.enums.PaymentMethod;
import com.example.common.enums.PaymentStatus;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class PaymentService {
    PaymentRepository paymentRepository;
    PaymentMapper paymentMapper;

    BookingRepository bookingRepository;

    public List<Payment> getPaymentsByBookingId(UUID bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }

    public LocalDateTime calculateExpiredAt(PaymentMethod method) {
        if (method == PaymentMethod.CASH) {
            return LocalDateTime.now().plusHours(6);
        }
        return LocalDateTime.now().plusMinutes(15);
    }

    public void cancelExpiredPayments(UUID bookingId) {
        List<Payment> expiredPayments = paymentRepository.findByBookingIdAndStatus(bookingId, PaymentStatus.PENDING);
        expiredPayments.forEach(payment -> payment.setStatus(PaymentStatus.FAILED));
        paymentRepository.saveAll(expiredPayments);
    }

    public PaymentResponse create(UUID bookingId, PaymentRequest request) {
        if(paymentRepository.existsByBookingIdAndStatus(bookingId, PaymentStatus.PENDING)) {
            throw new AppException(ErrorCode.PAYMENT_EXITS_PENDING);
        }
        Payment payment = paymentMapper.toEntity(request);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        payment.setBooking(booking);
        payment.setStatus(PaymentStatus.PENDING);
        return paymentMapper.toResponse(paymentRepository.save(payment));
    }

    public List<Payment> createPayments(List<PaymentRequest> requests, Booking booking) {
        return requests.stream()
                .map(p -> {
                    Payment payment = paymentMapper.toEntity(p);
                    payment.setBooking(booking);
                    payment.setStatus(PaymentStatus.PENDING);
                    return payment;
                })
                .toList();
    }
}

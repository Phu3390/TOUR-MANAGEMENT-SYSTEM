package com.example.booking.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.booking.entity.Payment;
import com.example.common.enums.PaymentStatus;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByBookingId(UUID bookingId);
    List<Payment> findByBookingIdAndStatus(UUID bookingId, PaymentStatus status);
    boolean existsByBookingIdAndStatus(UUID bookingId, PaymentStatus status);
}
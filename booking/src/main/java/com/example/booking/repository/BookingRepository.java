package com.example.booking.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.booking.entity.Booking;
import com.example.common.enums.BookingStatus;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID>, JpaSpecificationExecutor<Booking> {
    List<Booking> findAllByStatusAndExpiredAtBefore(BookingStatus status, LocalDateTime expiredAt);
    List<Booking> findAllByStatus(BookingStatus status);
    List<Booking> findByUserId(UUID userId);
    List<Booking> findByTourIdAndUserId(UUID tourId, UUID userId);
}

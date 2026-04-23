package com.example.booking.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.booking.entity.BookingVoucher;

@Repository
public interface BookingVoucherRepository extends JpaRepository<BookingVoucher, UUID> {}

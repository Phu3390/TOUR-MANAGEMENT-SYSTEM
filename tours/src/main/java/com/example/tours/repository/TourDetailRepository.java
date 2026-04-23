package com.example.tours.repository;

import com.example.common.enums.TourDetailStatus;
import com.example.tours.entity.TourDetail;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TourDetailRepository extends JpaRepository<TourDetail, UUID> {
    List<TourDetail> findByTourId(UUID tourId);
    
    List<TourDetail> findByTourIdAndStatus(UUID tourId, TourDetailStatus status);
    
    Page<TourDetail> findByTourId(UUID tourId, Pageable pageable);
    
    List<TourDetail> findByStartDayGreaterThanEqualAndStatus(LocalDate date, TourDetailStatus status);
    
    List<TourDetail> findByStatus(TourDetailStatus status);
}

package com.example.tours.repository;

import com.example.common.enums.PriceType;
import com.example.tours.entity.TourPrice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TourPriceRepository extends JpaRepository<TourPrice, UUID> {
    List<TourPrice> findByTourDetailId(UUID tourDetailId);

    boolean existsByTourDetailIdAndPriceType(UUID tourDetailId, PriceType priceType);

    boolean existsByTourDetailIdAndPriceTypeAndIdNot(UUID tourDetailId, PriceType priceType, UUID id);
    
    List<TourPrice> findByTourDetailIdAndPriceType(UUID tourDetailId, PriceType priceType);
}

package com.example.tours.repository;

import com.example.tours.entity.TourItinerary;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TourItineraryRepository extends JpaRepository<TourItinerary, UUID> {
    List<TourItinerary> findByTourDetailId(UUID tourDetailId);

    boolean existsByTourDetailId(UUID tourDetailId);

    boolean existsByIdNot(UUID id);
    
    List<TourItinerary> findByTourDetailId(UUID tourDetailId, Sort sort);
}

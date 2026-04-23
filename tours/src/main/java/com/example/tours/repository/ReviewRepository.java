package com.example.tours.repository;

import com.example.tours.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByTourId(UUID tourId);

    boolean existsByUserIdAndTourId(UUID userId, UUID tourId);

    // Page<Review> findByTourId(UUID tourId, Pageable pageable);
    
    List<Review> findByUserId(UUID userId);
    
    List<Review> findByTourIdAndRatingGreaterThanEqual(UUID tourId, Integer rating);
}

package com.example.tours.repository;

import com.example.common.enums.TourStatus;
import com.example.common.enums.TourType;
import com.example.tours.entity.Tour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TourRepository extends JpaRepository<Tour, UUID>, JpaSpecificationExecutor<Tour> {
    Optional<Tour> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, UUID id);

    List<Tour> findByStatus(TourStatus status);

    List<Tour> findByTourType(TourType tourType);

    Page<Tour> findByStatus(TourStatus status, Pageable pageable);

    Page<Tour> findByTourType(TourType tourType, Pageable pageable);

    Page<Tour> findByStatusAndTourType(TourStatus status, TourType tourType, Pageable pageable);

    Page<Tour> findByLocationContainingIgnoreCase(String location, Pageable pageable);

    Page<Tour> findByTitleContainingIgnoreCase(String title, Pageable pageable);
}

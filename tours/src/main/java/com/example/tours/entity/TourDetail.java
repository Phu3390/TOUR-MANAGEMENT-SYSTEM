package com.example.tours.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.example.common.enums.TourDetailStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tour_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TourDetail {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    @OneToMany(mappedBy = "tourDetail", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<TourPrice> tourPrices;

    @OneToMany(mappedBy = "tourDetail", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<TourItinerary> tourItineraries;
    
    @Column(name = "capacity", nullable = false)
    private Integer capacity;
    
    @Column(name = "remaining_seats", nullable = false)
    private Integer remainingSeats;
    
    @Column(name = "start_day", nullable = false)
    private LocalDate startDay;
    
    @Column(name = "end_day", nullable = false)
    private LocalDate endDay;
    
    @Column(name = "start_location", length = 255)
    private String startLocation;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TourDetailStatus status;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

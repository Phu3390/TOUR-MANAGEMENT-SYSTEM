package com.example.tours.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

import com.example.common.enums.TourStatus;
import com.example.common.enums.TourType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vladmihalcea.hibernate.type.json.JsonType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tours")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "title", length = 255, nullable = false)
    private String title;

    @Column(name = "slug", length = 255, unique = true)
    private String slug;

    @Column(name = "location", length = 255)
    private String location;

    @Column(name = "duration", length = 100)
    private String duration;

    @Column(name = "short_desc", length = 500)
    private String shortDesc;

    @Column(name = "long_desc", columnDefinition = "TEXT")
    private String longDesc;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Type(JsonType.class)
    @Column(name = "gallery", columnDefinition = "jsonb")
    private List<String> gallery; // JSON array

    @Column(name = "rating")
    private Double rating;

    @Column(name = "total_reviews")
    private Integer totalReviews;

    @Enumerated(EnumType.STRING)
    @Column(name = "tour_type", nullable = false)
    private TourType tourType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TourStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval =
    true)
    @JsonIgnore
    private List<TourDetail> tourDetails;

    // @OneToMany(mappedBy = "tourDetail",  cascade = CascadeType.ALL, orphanRemoval =
    // true)
    // @JsonIgnore
    // private List<TourPrice> prices;

    // @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval =
    // true)
    // @JsonIgnore
    // private List<Review> reviews;
}

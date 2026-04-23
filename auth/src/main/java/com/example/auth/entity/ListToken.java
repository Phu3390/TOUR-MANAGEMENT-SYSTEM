package com.example.auth.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "listtoken")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListToken {

    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "expiry_time", nullable = false)
    private Date expiryTime;
}

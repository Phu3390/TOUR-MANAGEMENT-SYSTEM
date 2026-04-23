package com.example.auth.repository;


import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.auth.entity.Permission;
import com.example.common.enums.Status;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, UUID> {
    Optional<Permission> findByName(String name);
    
    List<Permission> findByStatus(Status status);
    
    @Query("SELECT p FROM Permission p WHERE p.name LIKE %:name%")
    List<Permission> searchByName(@Param("name") String name);
}

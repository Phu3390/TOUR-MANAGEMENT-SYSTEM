package com.example.auth.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.auth.entity.Role;
import com.example.common.enums.Status;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID>, JpaSpecificationExecutor<Role> {
    Optional<Role> findByName(String name);
    
    List<Role> findByStatus(Status status);
    
    @Query("SELECT r FROM Role r WHERE r.name LIKE %:name%")
    List<Role> searchByName(@Param("name") String name);
    
    @Query("SELECT r FROM Role r LEFT JOIN FETCH r.rolePermissions WHERE r.id = :id")
    Optional<Role> findByIdWithPermissions(@Param("id") UUID id);
}

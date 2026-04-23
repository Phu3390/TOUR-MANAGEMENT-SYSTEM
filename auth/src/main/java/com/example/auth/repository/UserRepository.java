package com.example.auth.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.auth.entity.User;
import com.example.common.enums.Status;


@Repository
public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);

    boolean existsByEmailAndIdNot(String email, UUID id);
    
    boolean existsByEmail(String email);
    
    List<User> findByStatus(Status status);
    
    @Query("SELECT u FROM User u WHERE u.fullName LIKE %:fullName%")
    List<User> searchByFullName(@Param("fullName") String fullName);
    
    @Query("SELECT u FROM User u WHERE u.role.id = :roleId")
    List<User> findUsersByRoleId(@Param("roleId") UUID roleId);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.role WHERE u.id = :id")
    Optional<User> findByIdWithRole(@Param("id") UUID id);
}


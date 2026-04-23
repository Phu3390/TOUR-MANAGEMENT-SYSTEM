package com.example.auth.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.auth.entity.RolePermission;
import com.example.auth.entity.RolePermissionId;


@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, RolePermissionId> {
    
    List<RolePermission> findByRole_Id(UUID roleId);

    List<RolePermission> findByPermission_Id(UUID permissionId);

    @Query("SELECT rp FROM RolePermission rp WHERE rp.role.id = :roleId AND rp.permission.id = :permissionId")
    Optional<RolePermission> findByRoleIdAndPermissionId(@Param("roleId") UUID roleId,
                                                         @Param("permissionId") UUID permissionId);

    @Query("SELECT rp FROM RolePermission rp WHERE rp.role.id = :roleId AND rp.action = :action")
    List<RolePermission> findByRoleIdAndAction(@Param("roleId") UUID roleId,
                                               @Param("action") String action);

    void deleteByRole_Id(UUID roleId);

    void deleteByPermission_Id(UUID permissionId);
}

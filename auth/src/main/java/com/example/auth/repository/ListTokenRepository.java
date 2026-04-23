package com.example.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.auth.entity.ListToken;

@Repository
public interface ListTokenRepository extends JpaRepository<ListToken,String>{

}

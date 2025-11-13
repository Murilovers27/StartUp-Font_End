package com.example.mapsapi.repository;

import com.example.mapsapi.entity.User;
import com.example.mapsapi.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.mapsapi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByCpfCnpj(String cpfCnpj);

    List<User> findByRole(UserRole role);

    List<User> findByActiveTrue();

    List<User> findByActiveFalse();

    List<User> findAllByOrderByCreatedAtDesc();

    boolean existsByEmail(String email);

    boolean existsByCpfCnpj(String cpfCnpj);
}


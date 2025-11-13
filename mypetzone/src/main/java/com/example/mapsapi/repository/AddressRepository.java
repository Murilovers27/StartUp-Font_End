package com.example.mapsapi.repository;

import com.example.mapsapi.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    Optional<Address> findByFullAddressIgnoreCase(String fullAddress);

    List<Address> findAllByOrderByCreatedAtDesc();
}


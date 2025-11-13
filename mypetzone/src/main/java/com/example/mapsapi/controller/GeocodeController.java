package com.example.mapsapi.controller;

import com.example.mapsapi.dto.AddressRequest;
import com.example.mapsapi.dto.AddressResponse;
import com.example.mapsapi.service.GeocodeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/geocode")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GeocodeController {

    private final GeocodeService geocodeService;

    @PostMapping
    public ResponseEntity<AddressResponse> geocodeAddress(@Valid @RequestBody AddressRequest request) {
        AddressResponse response = geocodeService.geocodeAddress(request);
        HttpStatus status = response.isFromCache() ? HttpStatus.OK : HttpStatus.CREATED;
        return ResponseEntity.status(status).body(response);
    }

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getAllAddresses() {
        List<AddressResponse> addresses = geocodeService.getAllAddresses();
        return ResponseEntity.ok(addresses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressResponse> getAddressById(@PathVariable Long id) {
        AddressResponse response = geocodeService.getAddressById(id);
        return ResponseEntity.ok(response);
    }
}


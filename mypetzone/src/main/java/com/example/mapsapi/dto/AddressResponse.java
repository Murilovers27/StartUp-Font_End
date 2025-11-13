package com.example.mapsapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponse {

    private Long id;
    private String address;
    private String formattedAddress;
    private Double latitude;
    private Double longitude;
    private String googleMapsUrl;
    private boolean fromCache;
    private String message;
}


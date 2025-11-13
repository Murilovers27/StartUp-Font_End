package com.example.mapsapi.service;

import com.example.mapsapi.dto.AddressRequest;
import com.example.mapsapi.dto.AddressResponse;
import com.example.mapsapi.entity.Address;
import com.example.mapsapi.exception.GeocodeException;
import com.example.mapsapi.repository.AddressRepository;
import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.model.GeocodingResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeocodeService {

    private final AddressRepository addressRepository;
    private final GeoApiContext geoApiContext;

    @Transactional
    public AddressResponse geocodeAddress(AddressRequest request) {
        String addressInput = request.getAddress().trim();
        
        // Verifica se o endereço já está no banco de dados
        Optional<Address> existingAddress = addressRepository.findByFullAddressIgnoreCase(addressInput);
        
        if (existingAddress.isPresent()) {
            log.info("Endereço encontrado no cache: {}", addressInput);
            return mapToResponse(existingAddress.get(), true, "Endereço recuperado do cache");
        }

        // Se não existir, busca na API do Google Maps
        try {
            log.info("Buscando coordenadas na API do Google Maps para: {}", addressInput);
            GeocodingResult[] results = GeocodingApi.geocode(geoApiContext, addressInput).await();
            
            if (results == null || results.length == 0) {
                throw new GeocodeException("Nenhum resultado encontrado para o endereço: " + addressInput);
            }

            GeocodingResult result = results[0];
            
            // Cria nova entidade Address
            Address newAddress = new Address();
            newAddress.setFullAddress(addressInput);
            newAddress.setFormattedAddress(result.formattedAddress);
            newAddress.setLatitude(result.geometry.location.lat);
            newAddress.setLongitude(result.geometry.location.lng);
            
            // Salva no banco de dados
            Address savedAddress = addressRepository.save(newAddress);
            log.info("Novo endereço salvo: {} - Lat: {}, Lng: {}", 
                     savedAddress.getFormattedAddress(), 
                     savedAddress.getLatitude(), 
                     savedAddress.getLongitude());
            
            return mapToResponse(savedAddress, false, "Endereço geocodificado com sucesso");
            
        } catch (Exception e) {
            log.error("Erro ao geocodificar endereço: {}", addressInput, e);
            throw new GeocodeException("Erro ao geocodificar endereço: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<AddressResponse> getAllAddresses() {
        return addressRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(address -> mapToResponse(address, true, ""))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AddressResponse getAddressById(Long id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new GeocodeException("Endereço não encontrado com ID: " + id));
        return mapToResponse(address, true, "Endereço recuperado com sucesso");
    }

    private AddressResponse mapToResponse(Address address, boolean fromCache, String message) {
        String googleMapsUrl = String.format(
            "https://www.google.com/maps?q=%s,%s",
            address.getLatitude(),
            address.getLongitude()
        );

        return AddressResponse.builder()
                .id(address.getId())
                .address(address.getFullAddress())
                .formattedAddress(address.getFormattedAddress())
                .latitude(address.getLatitude())
                .longitude(address.getLongitude())
                .googleMapsUrl(googleMapsUrl)
                .fromCache(fromCache)
                .message(message)
                .build();
    }
}


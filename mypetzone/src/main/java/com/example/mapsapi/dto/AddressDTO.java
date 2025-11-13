package com.example.mapsapi.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDTO {

    @NotBlank(message = "A rua não pode estar vazia")
    private String street;

    @NotBlank(message = "O número não pode estar vazio")
    private String number;

    private String complement;

    @NotBlank(message = "O bairro não pode estar vazio")
    private String neighborhood;

    @NotBlank(message = "A cidade não pode estar vazia")
    private String city;

    @NotBlank(message = "O estado não pode estar vazio")
    private String state;

    @NotBlank(message = "O CEP não pode estar vazio")
    private String zipCode;

    private Double latitude;
    private Double longitude;
    private String formattedAddress;
    private String googleMapsUrl;
}

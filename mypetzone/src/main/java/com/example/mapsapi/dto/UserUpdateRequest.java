package com.example.mapsapi.dto;

import com.example.mapsapi.enums.CompanyType;
import com.example.mapsapi.enums.UserRole;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateRequest {

    private String name;

    @Email(message = "Email inválido")
    private String email;

    private String phone;

    private String cpfCnpj;

    private UserRole role;

    @Valid
    private AddressDTO address;

    private Boolean active;

    // Campos específicos para perfil EMPRESA
    private String companyName;
    private String tradeName;
    private String contactPerson;
    private Boolean acceptsPets;
    private CompanyType companyType;
}


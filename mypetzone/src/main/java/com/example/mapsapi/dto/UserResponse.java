package com.example.mapsapi.dto;

import com.example.mapsapi.enums.CompanyType;
import com.example.mapsapi.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String cpfCnpj;
    private UserRole role;
    private String roleDisplayName;
    private AddressDTO address;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Campos específicos para perfil EMPRESA
    private String companyName;
    private String tradeName;
    private String contactPerson;
    private Boolean acceptsPets;
    private CompanyType companyType;
    private String companyTypeDisplayName;
}


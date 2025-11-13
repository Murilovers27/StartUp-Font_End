package com.example.mapsapi.dto;

import com.example.mapsapi.enums.CompanyType;
import com.example.mapsapi.enums.UserRole;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class    UserCreateRequest {

    @NotBlank(message = "O nome não pode estar vazio")
    private String name;

    @NotBlank(message = "O email não pode estar vazio")
    @Email(message = "Email inválido")
    private String email;

    @NotBlank(message = "A senha não pode estar vazia")
    private String password;

    private String phone;
    private String cpfCnpj;

    @NotNull(message = "O perfil do usuário é obrigatório")
    private UserRole role;

    @Valid
    @NotNull(message = "O endereço é obrigatório")
    private AddressDTO address;

    private String companyName;
    private String tradeName;
    private String contactPerson;
    private Boolean acceptsPets;
    private CompanyType companyType;
}

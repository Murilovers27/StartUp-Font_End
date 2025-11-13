package com.example.mapsapi.service;

import com.example.mapsapi.dto.*;
import com.example.mapsapi.dto.auth.RegisterRequest;
import com.example.mapsapi.entity.Address;
import com.example.mapsapi.entity.User;
import com.example.mapsapi.enums.UserRole;
import com.example.mapsapi.exception.GeocodeException;
import com.example.mapsapi.repository.UserRepository;
import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.model.GeocodingResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final GeoApiContext geoApiContext;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse registerUser(RegisterRequest request) {
        // Verifica se as senhas conferem
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("As senhas não conferem");
        }

        // Verifica se o e-mail já está em uso
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado: " + request.getEmail());
        }

        // Cria um novo usuário
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setActive(true);

        // Salva o usuário
        User savedUser = userRepository.save(user);
        log.info("Novo usuário registrado: {}", savedUser.getEmail());
        
        return mapToResponse(savedUser);
    }

    @Transactional
    public UserResponse createUser(UserCreateRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new GeocodeException("Email já cadastrado: " + request.getEmail());
        }

        if (request.getCpfCnpj() != null && !request.getCpfCnpj().isEmpty()) {
            if (userRepository.existsByCpfCnpj(request.getCpfCnpj())) {
                throw new GeocodeException("CPF/CNPJ já cadastrado: " + request.getCpfCnpj());
            }
        }

        Address address = geocodeAddress(request.getAddress());

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setCpfCnpj(request.getCpfCnpj());
        user.setRole(request.getRole());
        user.setAddress(address);
        user.setActive(true);

        user.setCompanyName(request.getCompanyName());
        user.setTradeName(request.getTradeName());
        user.setContactPerson(request.getContactPerson());
        user.setAcceptsPets(request.getAcceptsPets());
        user.setCompanyType(request.getCompanyType());

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);
        log.info("Usuário criado com sucesso: {} ({})", savedUser.getName(), savedUser.getEmail());

        return mapToResponse(savedUser);
    }

    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new GeocodeException("Usuário não encontrado com ID: " + id));

        if (request.getName() != null) user.setName(request.getName());

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new GeocodeException("Email já cadastrado: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
        }

        if (request.getPhone() != null) user.setPhone(request.getPhone());

        if (request.getCpfCnpj() != null && !request.getCpfCnpj().equals(user.getCpfCnpj())) {
            if (userRepository.existsByCpfCnpj(request.getCpfCnpj())) {
                throw new GeocodeException("CPF/CNPJ já cadastrado: " + request.getCpfCnpj());
            }
            user.setCpfCnpj(request.getCpfCnpj());
        }

        if (request.getRole() != null) user.setRole(request.getRole());

        if (request.getActive() != null) user.setActive(request.getActive());

        if (request.getAddress() != null) {
            Address newAddress = geocodeAddress(request.getAddress());
            user.setAddress(newAddress);
        }

        if (user.getRole() == UserRole.EMPRESA) {
            if (request.getCompanyName() != null) user.setCompanyName(request.getCompanyName());
            if (request.getTradeName() != null) user.setTradeName(request.getTradeName());
            if (request.getContactPerson() != null) user.setContactPerson(request.getContactPerson());
            if (request.getAcceptsPets() != null) user.setAcceptsPets(request.getAcceptsPets());
            if (request.getCompanyType() != null) user.setCompanyType(request.getCompanyType());
        }

        User updatedUser = userRepository.save(user);
        log.info("Usuário atualizado: {} (ID: {})", updatedUser.getName(), updatedUser.getId());

        return mapToResponse(updatedUser);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new GeocodeException("Usuário não encontrado com ID: " + id));
        return mapToResponse(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUsersByRole(com.example.mapsapi.enums.UserRole role) {
        return userRepository.findByRole(role)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getActiveUsers() {
        return userRepository.findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new GeocodeException("Usuário não encontrado com ID: " + id));
        userRepository.delete(user);
        log.info("Usuário deletado: {} (ID: {})", user.getName(), user.getId());
    }

    @Transactional
    public UserResponse deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new GeocodeException("Usuário não encontrado com ID: " + id));
        user.setActive(false);
        User deactivatedUser = userRepository.save(user);
        log.info("Usuário desativado: {} (ID: {})", user.getName(), user.getId());
        return mapToResponse(deactivatedUser);
    }

    @Transactional
    public UserResponse activateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new GeocodeException("Usuário não encontrado com ID: " + id));
        user.setActive(true);
        User activatedUser = userRepository.save(user);
        log.info("Usuário ativado: {} (ID: {})", user.getName(), user.getId());
        return mapToResponse(activatedUser);
    }

    private Address geocodeAddress(AddressDTO addressDTO) {
        try {
            String fullAddress = String.format("%s, %s, %s, %s - %s, %s",
                    addressDTO.getStreet(),
                    addressDTO.getNumber(),
                    addressDTO.getNeighborhood(),
                    addressDTO.getCity(),
                    addressDTO.getState(),
                    addressDTO.getZipCode());

            log.info("Geocodificando endereço: {}", fullAddress);
            GeocodingResult[] results = GeocodingApi.geocode(geoApiContext, fullAddress).await();

            if (results == null || results.length == 0) {
                throw new GeocodeException("Não foi possível geocodificar o endereço informado");
            }

            GeocodingResult result = results[0];

            Address address = new Address();
            address.setFullAddress(fullAddress);
            address.setFormattedAddress(result.formattedAddress);
            address.setLatitude(result.geometry.location.lat);
            address.setLongitude(result.geometry.location.lng);
            address.setStreet(addressDTO.getStreet());
            address.setNumber(addressDTO.getNumber());
            address.setComplement(addressDTO.getComplement());
            address.setNeighborhood(addressDTO.getNeighborhood());
            address.setCity(addressDTO.getCity());
            address.setState(addressDTO.getState());
            address.setZipCode(addressDTO.getZipCode());

            return address;

        } catch (Exception e) {
            log.error("Erro ao geocodificar endereço", e);
            throw new GeocodeException("Erro ao geocodificar endereço: " + e.getMessage());
        }
    }

    private UserResponse mapToResponse(User user) {
        AddressDTO addressDTO = null;
        if (user.getAddress() != null) {
            Address address = user.getAddress();
            addressDTO = AddressDTO.builder()
                    .street(address.getStreet())
                    .number(address.getNumber())
                    .complement(address.getComplement())
                    .neighborhood(address.getNeighborhood())
                    .city(address.getCity())
                    .state(address.getState())
                    .zipCode(address.getZipCode())
                    .latitude(address.getLatitude())
                    .longitude(address.getLongitude())
                    .formattedAddress(address.getFormattedAddress())
                    .googleMapsUrl(String.format("https://www.google.com/maps?q=%s,%s",
                            address.getLatitude(), address.getLongitude()))
                    .build();
        }

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .cpfCnpj(user.getCpfCnpj())
                .role(user.getRole())
                .roleDisplayName(user.getRole().getDisplayName())
                .address(addressDTO)
                .active(user.getActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .companyName(user.getCompanyName())
                .tradeName(user.getTradeName())
                .contactPerson(user.getContactPerson())
                .acceptsPets(user.getAcceptsPets())
                .companyType(user.getCompanyType())
                .companyTypeDisplayName(user.getCompanyType() != null ? user.getCompanyType().getDisplayName() : null)
                .build();
    }
}

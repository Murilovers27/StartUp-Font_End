package com.example.mapsapi.controller;

import com.example.mapsapi.dto.AuthResponse;
import com.example.mapsapi.dto.LoginRequest;
import com.example.mapsapi.dto.RefreshTokenRequest;
import com.example.mapsapi.security.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "APIs para autenticação de usuários")
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @PostMapping("/login")
    @Operation(summary = "Autentica um usuário e retorna tokens JWT")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
                )
            );
            
            if (authentication.isAuthenticated()) {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                String accessToken = jwtService.generateAccessToken(userDetails);
                String refreshToken = jwtService.generateRefreshToken(userDetails);
                
                log.info("Usuário autenticado com sucesso: {}", request.getEmail());
                
                return ResponseEntity.ok(AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .build());
            }
            
            throw new BadCredentialsException("Credenciais inválidas");
            
        } catch (Exception e) {
            log.error("Falha na autenticação para o usuário: {}", request.getEmail(), e);
            throw new BadCredentialsException("Falha na autenticação: " + e.getMessage());
        }
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Gera um novo access token usando um refresh token válido")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        try {
            String refreshToken = request.getRefreshToken();
            
            if (jwtService.validateToken(refreshToken)) {
                String username = jwtService.extractUsername(refreshToken);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                String newAccessToken = jwtService.generateAccessToken(userDetails);
                
                log.info("Novo access token gerado para o usuário: {}", username);
                
                return ResponseEntity.ok(AuthResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(refreshToken) // O mesmo refresh token é retornado
                    .build());
            }
            
            throw new BadCredentialsException("Refresh token inválido ou expirado");
            
        } catch (Exception e) {
            log.error("Falha ao renovar token: {}", e.getMessage());
            throw new BadCredentialsException("Falha ao renovar token: " + e.getMessage());
        }
    }
}

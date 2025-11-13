package com.example.mapsapi.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Configuração de segurança da aplicação.
 * Define as políticas de segurança, autenticação e autorização.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private static final String[] PUBLIC_ENDPOINTS = {
        "/api/auth/**",
        "/api/users/register",  // Endpoint de registro público
        "/api/users",           // Listagem de usuários pública
        "/v3/api-docs/**",
        "/swagger-ui/**",
        "/swagger-ui.html",
        "/h2-console/**"
    };
    private final JpaUserDetailsService userDetailsService;
    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Configuração CORS
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
        
        // Desabilita CSRF (não é necessário para APIs stateless)
        http.csrf(AbstractHttpConfigurer::disable);
        
        // Configuração de sessão stateless
        http.sessionManagement(session -> 
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );
        
        // Configuração de autorização de requisições
        http.authorizeHttpRequests(auth -> auth
            .requestMatchers(createAntMatchers(PUBLIC_ENDPOINTS)).permitAll()
            .anyRequest().authenticated()
        );
        
        // Configuração para o H2 Console (apenas para desenvolvimento)
        http.headers(headers -> 
            headers.frameOptions(frame -> 
                frame.sameOrigin()
            )
        );
        
        // Adiciona o filtro JWT antes do filtro de autenticação padrão
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        // Configura o provedor de autenticação
        http.authenticationProvider(authProvider());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Em produção, substitua por origens específicas
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
        configuration.setExposedHeaders(List.of("Authorization"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    /**
     * Cria um array de AntPathRequestMatcher a partir de um array de padrões de URL.
     * Isso é necessário para evitar ambiguidade no mapeamento de URLs.
     */
    private AntPathRequestMatcher[] createAntMatchers(String... patterns) {
        return Arrays.stream(patterns)
            .map(AntPathRequestMatcher::new)
            .toArray(AntPathRequestMatcher[]::new);
    }
}

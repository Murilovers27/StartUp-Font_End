package com.example.mapsapi.config;

import com.example.mapsapi.entity.User;
import com.example.mapsapi.enums.UserRole;
import com.example.mapsapi.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DevSeedConfig {

    @Bean
    CommandLineRunner seedUsers(UserRepository repo, PasswordEncoder encoder) {
        return args -> {
            if (!repo.existsByEmail("admin@demo.com")) {
                User u = new User();
                u.setName("Admin");
                u.setEmail("admin@demo.com");
                u.setPassword(encoder.encode("123456"));
                u.setRole(UserRole.EMPRESA);
                u.setActive(true);
                repo.save(u);
            }
        };
    }
}

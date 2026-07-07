package com.is3.eventmanager.service;

import com.is3.eventmanager.dto.RegisterRequest;
import com.is3.eventmanager.dto.LoginRequest;
import com.is3.eventmanager.dto.LoginResponse;
import com.is3.eventmanager.entity.User;
import com.is3.eventmanager.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder =  passwordEncoder;
    }

    public void register(RegisterRequest request) {

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // temporalmente SIN BCrypt
        // user.setPasswordHash(request.getPassword());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);
    }


    public LoginResponse login(LoginRequest request) {

    Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

    if (optionalUser.isEmpty()) {
        throw new RuntimeException("Invalid credentials");
    }

    User user = optionalUser.get();

    if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
        throw new RuntimeException("Invalid credentials");
    }

    LoginResponse response = new LoginResponse();

    // Token temporal para que el frontend funcione.
    response.setToken("demo-token");

    // El frontend espera estos campos.
    response.setUsername(user.getName());
    response.setFullName(user.getName());
    response.setEmail(user.getEmail());

    // Temporalmente todos serán ADMIN.
    response.setRole("ADMIN");

    return response;
}
}

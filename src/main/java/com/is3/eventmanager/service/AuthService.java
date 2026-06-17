package com.is3.eventmanager.service;

import com.is3.eventmanager.dto.RegisterRequest;
import com.is3.eventmanager.entity.User;
import com.is3.eventmanager.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void register(RegisterRequest request) {

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // temporalmente SIN BCrypt
        user.setPasswordHash(request.getPassword());

        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);
    }
}

package com.is3.eventmanager.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.is3.eventmanager.dto.LoginRequest;
import com.is3.eventmanager.dto.LoginResponse;
import com.is3.eventmanager.dto.RegisterRequest;
import com.is3.eventmanager.entity.User;
import com.is3.eventmanager.repository.UserRepository;
import com.is3.eventmanager.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder, jwtService);
    }

    @Test
    void register_ShouldSaveUserWithHashedPassword() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setName("John Doe");
        request.setEmail("john@email.com");
        request.setPassword("password123");

        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");

        // Act
        authService.register(request);

        // Assert
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        
        User savedUser = userCaptor.getValue();
        assertEquals("John Doe", savedUser.getName());
        assertEquals("john@email.com", savedUser.getEmail());
        assertEquals("hashedPassword", savedUser.getPasswordHash());
        assertNotNull(savedUser.getCreatedAt());
    }

    @Test
    void login_ShouldReturnResponse_WhenCredentialsAreValid() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("john@email.com");
        request.setPassword("password123");

        User user = new User();
        user.setName("John Doe");
        user.setEmail("john@email.com");
        user.setPasswordHash("hashedPassword");

        when(userRepository.findByEmail("john@email.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "hashedPassword")).thenReturn(true);
        when(jwtService.generateToken("john@email.com")).thenReturn("mockedJwtToken");

        // Act
        LoginResponse response = authService.login(request);

        // Assert
        assertNotNull(response);
        assertEquals("mockedJwtToken", response.getToken());
        assertEquals("John Doe", response.getUsername());
        assertEquals("John Doe", response.getFullName());
        assertEquals("john@email.com", response.getEmail());
        assertEquals("ADMIN", response.getRole());
    }

    @Test
    void login_ShouldThrowException_WhenUserNotFound() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("unknown@email.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("unknown@email.com")).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("Invalid credentials", exception.getMessage());
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtService, never()).generateToken(anyString());
    }

    @Test
    void login_ShouldThrowException_WhenPasswordIsIncorrect() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("john@email.com");
        request.setPassword("wrongPassword");

        User user = new User();
        user.setEmail("john@email.com");
        user.setPasswordHash("hashedPassword");

        when(userRepository.findByEmail("john@email.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongPassword", "hashedPassword")).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("Invalid credentials", exception.getMessage());
        verify(jwtService, never()).generateToken(anyString());
    }
}

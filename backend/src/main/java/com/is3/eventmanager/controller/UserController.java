package com.is3.eventmanager.controller;

import com.is3.eventmanager.dto.UserProfileResponse;
import com.is3.eventmanager.entity.User;
import com.is3.eventmanager.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.is3.eventmanager.dto.UpdateUserProfileRequest;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public UserProfileResponse getCurrentUser(
        Authentication authentication
    ) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                new RuntimeException("User not found")
            );

        return new UserProfileResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getCreatedAt()
        );
    }


    @PutMapping("/me")
    public UserProfileResponse updateCurrentUser(
    Authentication authentication,
    @RequestBody UpdateUserProfileRequest request
    ) {
      String currentEmail = authentication.getName();

      User user = userRepository.findByEmail(currentEmail)
          .orElseThrow(() ->
              new RuntimeException("User not found")
          );

      user.setName(request.getName());
      user.setEmail(request.getEmail());

      User updatedUser = userRepository.save(user);

      return new UserProfileResponse(
        updatedUser.getId(),
        updatedUser.getName(),
        updatedUser.getEmail(),
        updatedUser.getCreatedAt()
      );
    }
}

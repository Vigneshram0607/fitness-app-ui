package com.fitness.userservice.service;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserService {
    @Autowired
    private UserRepository userRepository;

    private static UserResponse getUserResponse(User savedUserResponse) {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(savedUserResponse.getId());
        userResponse.setKeycloakId(savedUserResponse.getKeycloakId());
        userResponse.setEmail(savedUserResponse.getEmail());
        userResponse.setPassword(savedUserResponse.getPassword());
        userResponse.setFirstName(savedUserResponse.getFirstName());
        userResponse.setLastName(savedUserResponse.getLastName());
        userResponse.setCreatedAt(savedUserResponse.getCreatedAt());
        userResponse.setUpdateAt(savedUserResponse.getUpdateAt());
        return userResponse;
    }


    public UserResponse register(@Valid RegisterRequest request) {
        if(userRepository.existsByEmail(request.getEmail())){
            User existingUser = userRepository.findByEmail(request.getEmail());
            return getUserResponse(existingUser);
        }
        User user = new User();
        user.setKeycloakId(request.getKeycloakId());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User savedUserResponse = userRepository.save(user);

        return getUserResponse(savedUserResponse);
    }

    public UserResponse getUserProfile(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User Not Found!"));
        return getUserResponse(user);
    }

    public Boolean existByUserId(String userId) {
        log.info("Calling user validation api for user ID: {}",userId);
        return userRepository.existsByKeycloakId(userId);
    }
}

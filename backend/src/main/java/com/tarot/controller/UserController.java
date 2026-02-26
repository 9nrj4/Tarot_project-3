package com.tarot.controller;

import com.tarot.dto.UpdateProfileRequest;
import com.tarot.dto.UserDto;
import com.tarot.model.User;
import com.tarot.repository.UserRepository;
import com.tarot.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    public UserController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public UserDto me(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));
        return userService.toDto(user);
    }

    @PutMapping("/me")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public UserDto updateMe(@RequestBody UpdateProfileRequest req, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));
        if (req.getName() != null && !req.getName().isBlank()) {
            user.setName(req.getName().trim());
        }
        return userService.toDto(userRepository.save(user));
    }
}





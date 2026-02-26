package com.tarot.controller;

import com.tarot.dto.LoginRequest;
import com.tarot.dto.RegisterRequest;
import com.tarot.dto.UserDto;
import com.tarot.model.User;
import com.tarot.repository.UserRepository;
import com.tarot.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;

    public AuthController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody RegisterRequest req) {
        UserDto user = userService.register(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody LoginRequest req) {
        UserDto user = userService.login(req);
        return ResponseEntity.ok(user);
    }

    /**
     * Восстановление пароля (демо‑реализация).
     * На практике здесь должна быть отправка ссылки на email.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody LoginRequest req) {
        // Ищем пользователя по email и просто возвращаем успешный ответ.
        // Для учебного проекта достаточно продемонстрировать эндпоинт.
        userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Пользователь с таким email не найден"));
        return ResponseEntity.ok().body("Ссылка для восстановления пароля отправлена (демо-режим).");
    }

    /**
     * Простое изменение пароля по email (без токенов, для учебной демонстрации).
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody LoginRequest req) {
        // в LoginRequest здесь используется поле password как новый пароль
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Пользователь с таким email не найден"));
        user.setPasswordHash(userService.encodePassword(req.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok().body("Пароль успешно изменён.");
    }
}



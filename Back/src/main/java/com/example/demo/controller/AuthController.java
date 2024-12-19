package com.example.demo.controller;

import com.example.demo.component.JwtUtil;
import com.example.demo.dto.JwtDto;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userService.findByUserId(user.getUserId()) != null) {
            return ResponseEntity.status(400).body("User ID already exists.");
        }

        user.setUserPw(passwordEncoder.encode(user.getUserPw()));
        userService.signup(user);

        return ResponseEntity.ok("Signup successful.");
    }

    @PostMapping("/login")
    public ResponseEntity<JwtDto> login(@RequestBody Map<String, String> credentials) {
        String userId = credentials.get("userId");

        User user = userService.findByUserId(userId);
        if (user == null || !passwordEncoder.matches(credentials.get("userPw"), user.getUserPw())) {
            return ResponseEntity.status(401).body(new JwtDto(null, null, null,"사용자 ID 또는 비밀번호가 잘못되었습니다."));
        }

        String accessToken = jwtUtil.generateToken(user.getUserId());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUserId());

        return ResponseEntity.ok(new JwtDto(userId, user.getEmail(), accessToken, refreshToken));
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtDto> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (jwtUtil.isTokenExpired(refreshToken)) {
            return ResponseEntity.status(403).body(null);
        }

        String userId = jwtUtil.extractUserId(refreshToken);
        User user = userService.findByUserId(userId);
        if (user == null) {
            return ResponseEntity.status(404).body(null);
        }

        String newAccessToken = jwtUtil.generateToken(userId); // Access Token 생성

        return ResponseEntity.ok(new JwtDto(userId, user.getEmail(), newAccessToken, refreshToken)); // Refresh Token도 함께 반환
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Authorization header missing or invalid.");
        }
        String token = header.substring(7);
        if (jwtUtil.isTokenExpired(token)) {
            return ResponseEntity.status(401).body("Token expired.");
        }
        return ResponseEntity.ok("Token is valid.");
    }
}
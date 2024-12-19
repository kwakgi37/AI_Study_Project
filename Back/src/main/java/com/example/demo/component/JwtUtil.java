package com.example.demo.component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secretKey}")
    private String secretKey;

    // JWT 생성
    public String generateToken(String userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId); // 사용자 ID를 claims에 추가
        return createToken(claims, userId, 1000 * 60 * 60 * 4); // 60초 만료시간 지정 나중에 4시간으로 변경
    }

    // Refresh Token 생성
    public String generateRefreshToken(String userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId); // 사용자 ID를 claims에 추가
        return createToken(claims, userId, 1000L * 60 * 60 * 24 * 3); // 3일 유효기간
    }

    // JWT 토큰 생성
    private String createToken(Map<String, Object> claims, String subject, long expirationTime) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    // 사용자 ID 추출
    public String extractUserId(String token) {
        return extractAllClaims(token).get("userId", String.class); // userId를 claims에서 추출
    }

    // 모든 Claims 추출
    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            throw new RuntimeException("Invalid token");
        }
    }

    // 토큰 만료 여부 확인
    public Boolean isTokenExpired(String token) {
        try {
            return extractAllClaims(token).getExpiration().before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
}

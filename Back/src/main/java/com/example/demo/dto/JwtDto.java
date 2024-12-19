package com.example.demo.dto;

import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JwtDto {

    private String userId;
    private String email;
    private String accessToken;
    private String refreshToken; // Refresh Token 필드 추가

}


package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TestResultDto {

    private int correctCount; // 정답 개수
    private int wrongCount;   // 오답 개수
    private String totalScore; // 총 점수
    private String testTime;   // 소요 시간
}

package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TestDto {

    private String userId;
    private String year;
    private String month;
    private List<String> userAnswer; // 사용자 답안 배열로 저장
    private String testTime; //소요 시간
}

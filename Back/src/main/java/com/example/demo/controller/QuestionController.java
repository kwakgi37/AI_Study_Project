package com.example.demo.controller;

import com.example.demo.dto.QuestionDto;
import com.example.demo.entity.Question;
import com.example.demo.service.QuestionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth/question")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    // 년, 월에 따른 문제 불러오는 것
    @GetMapping("/{year}/{month}")
    public ResponseEntity<List<QuestionDto>> getQuestionsByYearAndMonth(
            @PathVariable String year,
            @PathVariable String month) {
        List<Question> questions = questionService.getQuestionsByYearAndMonth(year, month);
        if (questions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        // QuestionDto 객체로 변환하여 필요한 필드만 전송
        List<QuestionDto> questionDtos = questions.stream()
                .map(q -> new QuestionDto(q.getNumber(), q.getText(), q.getRightAnswer(),q.getDescription(), q.getType()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(questionDtos);
    }
    // 년, 월, 타입에 따른 문제 불러오는 것
    @GetMapping("/{year}/{month}/{type}")
    public ResponseEntity<List<QuestionDto>> getQuestionsByYearAndMonthAndType(
            @PathVariable String year,
            @PathVariable String month,
            @PathVariable String type) {
        List<Question> questions = questionService.getQuestionByYearAndMonthAndType(year, month, type);
        if (questions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        // QuestionDto 객체로 변환하여 필요한 필드만 전송
        List<QuestionDto> questionDtos = questions.stream()
                .map(q -> new QuestionDto(q.getNumber(), q.getText(), q.getRightAnswer(),q.getDescription(), q.getType()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(questionDtos);
    }

}

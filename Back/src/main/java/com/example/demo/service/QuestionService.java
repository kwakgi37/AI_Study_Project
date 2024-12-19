package com.example.demo.service;

import com.example.demo.entity.Question;
import com.example.demo.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {


    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public List<Question> getQuestionsByYearAndMonth(String year, String month) {
        return questionRepository.findAllByYearAndMonth(year, month);
    }

    public List<Question> getQuestionByYearAndMonthAndType(String year, String month, String type) {
        return questionRepository.findAllByYearAndMonthAndType(year, month, type);
    }
}

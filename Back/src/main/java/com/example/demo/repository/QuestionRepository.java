package com.example.demo.repository;

import com.example.demo.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    //년, 월에 따른 문제
    List<Question> findAllByYearAndMonth(String year, String month);
    // 년, 월, 타입에 따른 문제
    List<Question> findAllByYearAndMonthAndType(String year, String month, String type);
}

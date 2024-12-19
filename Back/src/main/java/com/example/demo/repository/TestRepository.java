package com.example.demo.repository;

import com.example.demo.entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TestRepository extends JpaRepository<Test, Long> {

    // userId, yearAndMonth로 모든 문제지 뽑아오기
    @Query("SELECT t FROM Test t WHERE t.userId = :userId AND t.yearAndMonth = :yearAndMonth")
    
    List<Test> findByUserIdAndYearAndMonth(@Param("userId") String userId, @Param("yearAndMonth") String yearAndMonth);

    // id, userId, yearAndMonth로 해당 문제지 뽑아오기
    @Query("SELECT t FROM Test t WHERE t.id = :id AND t.userId = :userId AND t.yearAndMonth = :yearAndMonth")
    Optional<Test> findByIdAndUserIdAndYearAndMonth(@Param("id") Long id, @Param("userId") String userId, @Param("yearAndMonth") String yearAndMonth);

    // userId, yearAndMonth로 해당 최신 문제지 뽑아오기
    @Query("SELECT t FROM Test t WHERE t.userId = :userId AND t.yearAndMonth = :yearAndMonth ORDER BY t.id DESC LIMIT 1")
    Optional<Test> findTopByUserIdAndYearAndMonth(@Param("userId") String userId, @Param("yearAndMonth") String yearAndMonth);

    // userId에 해당하는 최신 문제지 8개 뽑아오기
    @Query("SELECT t FROM Test t WHERE t.userId = :userId ORDER BY t.id DESC LIMIT 8")
    List<Test> findEightTestByUserId(@Param("userId") String userId);

    // userId(유저가 친 시험중 가장 최신 시험지)
    @Query("SELECT t FROM Test t WHERE t.userId = :userId ORDER BY t.id DESC LIMIT 1")
    Optional<Test> findByLastTestByUserId(@Param("userId") String userId);
}

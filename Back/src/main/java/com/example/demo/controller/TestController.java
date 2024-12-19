package com.example.demo.controller;

import com.example.demo.dto.TestResultDto;
import com.example.demo.entity.Question;
import com.example.demo.entity.Test;
import com.example.demo.service.TestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth/test")
public class TestController {

    private final TestService testService;

    public TestController(TestService testService) {
        this.testService = testService;
    }

    // 테스트 시험지 저장
    @PostMapping("/submit")
    public ResponseEntity<TestResultDto> submitTest(
            @RequestParam String userId,
            @RequestParam String year,
            @RequestParam String month,
            @RequestBody List<String> userAnswer,
            @RequestParam String testTime) {

        TestResultDto result = testService.calculateAndSaveScore(userId, year, month, userAnswer, testTime);
        return ResponseEntity.ok(result);
    }

    // 이건 id, userid, yearAndMonth를 통해서 시험지를 뽑아오는 것
    @GetMapping("/getTest")
    public ResponseEntity<Test> getTest(
            @RequestParam Long id,
            @RequestParam String userId,
            @RequestParam String yearAndMonth) {

        Optional<Test> test = testService.getTestByIdUserIdAndYearAndMonth(id, userId, yearAndMonth);

        return test.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 이건 userid, yearAndMonth에 맞는 최신 시험지를 뽑아오는 것
    @GetMapping("/getRecentTest")
    public ResponseEntity<Test> getRecentTest(
            @RequestParam String userId,
            @RequestParam String yearAndMonth) {

        Optional<Test> test = testService.getTestTopByUserIdAndYearAndMonth(userId, yearAndMonth);

        return test.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 유저의 가장 마지막에 친 시험의
    @GetMapping("/getLastTest")
    public ResponseEntity<Test> getLastTest(
            @RequestParam String userId) {

        Optional<Test> test = testService.getRecentTestByUserId(userId);

        return test.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }   

    // userId에 맞는 최신 문제지 8개 뽑아오기
    @GetMapping("/getEightTest")
    public ResponseEntity<List<Test>> getEightTest(
            @RequestParam String userId) {
        List<Test> tests = testService.getEightTestByUserId(userId);

        return tests.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tests);
    }

    // 사용자와 해당 년, 월에 따른 모든 문제지를 뽑아오기
    @GetMapping("/getAllTest")
    public ResponseEntity<List<Test>> getAllTest(
            @RequestParam String userId,
            @RequestParam String yearAndMonth) {
        List<Test> tests = testService.getAllTestByUserIdAndYearAndMonth(userId, yearAndMonth);
        return tests.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tests);
    }

    // 틀린 문제를 뽑아오는 것
    @GetMapping("/incorrectQuestions")
    public ResponseEntity<List<Question>> getIncorrectQuestions(
            @RequestParam Long id,
            @RequestParam String userId,
            @RequestParam String yearAndMonth) {

        List<Question> incorrectQuestions = testService.getIncorrectQuestions(id, userId, yearAndMonth);

        if (incorrectQuestions.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(incorrectQuestions);
    }

    // 맞는 문제를 뽑아오는 것
        @GetMapping("/correctQuestions")
    public ResponseEntity<List<Question>> getCorrectQuestions(
            @RequestParam Long id,
            @RequestParam String userId,
            @RequestParam String yearAndMonth) {

        List<Question> correctQuestions = testService.getCorrectQuestions(id, userId, yearAndMonth);

        if (correctQuestions.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(correctQuestions);
    }

    // 문제별 유형 맞은 갯수 반환
    @GetMapping("/correctQuestionCounts")
    public ResponseEntity<Map<String, Integer>> getCorrectQuestionCounts(
            @RequestParam Long id,
            @RequestParam String userId,
            @RequestParam String yearAndMonth) {

        Map<String, Integer> counts = testService.getCorrectQuestionsAndCounts(id, userId, yearAndMonth);

        if (counts.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(counts);
    }


    // 오답 문제를 풀었을 때 시험지의 번호에 맞는 해당 인덱스가 업데이트되는 것
    @PostMapping("/updateAnswer")
    public ResponseEntity<?> updateUserAnswer(
            @RequestParam Long id,
            @RequestParam String userId,
            @RequestParam String yearAndMonth,
            @RequestParam String questionNumber,
            @RequestParam String newAnswer) {

        Optional<Test> testOptional = testService.getTestByIdUserIdAndYearAndMonth(id, userId, yearAndMonth);
        if (testOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("시험지를 찾을 수 없습니다.");
        }

        Test test = testOptional.get();

        // String 필드를 List로 변환 (콤마로 구분된 값이라고 가정)
        String userAnswerString = test.getUserAnswer();
        List<String> userAnswers = new ArrayList<>(Arrays.asList(userAnswerString.split("")));

        // 문제 번호를 인덱스로 변환
        int questionIndex;
        try {
            int questionNum = Integer.parseInt(questionNumber);
            questionIndex = questionNum - 18;
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("유효하지 않은 문제 번호입니다.");
        }

        if (questionIndex < 0 || questionIndex >= userAnswers.size()) {
            return ResponseEntity.badRequest().body("문제 번호가 유효하지 않습니다.");
        }

        // 답안 수정
        userAnswers.set(questionIndex, newAnswer);

        // List를 다시 String으로 변환
        String updatedUserAnswerString = String.join("", userAnswers);
        test.setUserAnswer(updatedUserAnswerString);

        Test updatedTest = testService.saveTest(test);
        return ResponseEntity.ok(updatedTest);
    }



}

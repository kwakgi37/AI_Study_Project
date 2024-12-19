package com.example.demo.service;

import com.example.demo.dto.TestResultDto;
import com.example.demo.entity.Question;
import com.example.demo.entity.Test;
import com.example.demo.repository.QuestionRepository;
import com.example.demo.repository.TestRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class TestService {

    private final TestRepository testRepository;
    private final QuestionRepository questionRepository;

    public TestService(TestRepository testRepository, QuestionRepository questionRepository) {
        this.testRepository = testRepository;
        this.questionRepository = questionRepository;
    }

    // 답 비교 후 시험지 저장
    @Transactional
    public TestResultDto calculateAndSaveScore(String userId, String year, String month, List<String> userAnswer, String testTime) {
        List<Question> questions = questionRepository.findAllByYearAndMonth(year, month);

        int correctCount = 0;
        int totalScore = 0;

        for (int i = 0; i < questions.size(); i++) {
            Question question = questions.get(i);
            if (i < userAnswer.size() && question.getRightAnswer().equals(userAnswer.get(i))) {
                correctCount++;
                totalScore += Integer.parseInt(question.getPoint());
            }
        }

        int wrongCount = questions.size() - correctCount;

        Test test = new Test();
        test.setUserId(userId);
        test.setYearAndMonth(year + "-" + month);
        test.setUserAnswer(String.join("", userAnswer));
        test.setScore(String.valueOf(totalScore));
        test.setTestDay(LocalDateTime.now());
        test.setTestTime(testTime);

        testRepository.save(test);

        return new TestResultDto(correctCount, wrongCount, String.valueOf(totalScore), testTime);
    }

    // userId, yearAndMonth로 문제지 다 찾기
    public List<Test> getAllTestByUserIdAndYearAndMonth(String userId, String yearAndMonth) {
        return testRepository.findByUserIdAndYearAndMonth(userId, yearAndMonth);
    }

    // userId로 문제지 찾기
    public List<Test> getEightTestByUserId(String userId) {
        return testRepository.findEightTestByUserId(userId);
    }

    // id , userId, yearAndMonth로 문제지 찾기
    public Optional<Test> getTestByIdUserIdAndYearAndMonth(Long id, String userId, String yearAndMonth) {
        return testRepository.findByIdAndUserIdAndYearAndMonth(id, userId, yearAndMonth);
    }

    // userId, yearAndMonth로 최신 문제지 찾기
    public Optional<Test> getTestTopByUserIdAndYearAndMonth(String userId, String yearAndMonth) {
        return testRepository.findTopByUserIdAndYearAndMonth(userId, yearAndMonth);
    }

    // userId(유저가 친 시험중 가장 최신 시험지)
    public Optional<Test> getRecentTestByUserId(String userId) {
        return testRepository.findByLastTestByUserId(userId);
    }

    // useAnswer과 question을 비교해서 틀린 문제를 뽑아오게 하는 서비스
    public List<Question> getIncorrectQuestions(Long id, String userId, String yearAndMonth) {
        // 시험지 데이터 가져오기
        Optional<Test> testOptional = testRepository.findByIdAndUserIdAndYearAndMonth(id, userId, yearAndMonth);
        if (testOptional.isEmpty()) {
            return new ArrayList<>(); // 시험지를 찾지 못하면 빈 리스트 반환
        }
        Test test = testOptional.get();

        // 질문 데이터 가져오기
        String[] ym = yearAndMonth.split("-");
        String year = ym[0];
        String month = ym[1];
        List<Question> questions = questionRepository.findAllByYearAndMonth(year, month);

        // 사용자 답안 문자열을 인덱스 별로 비교
        String userAnswers = test.getUserAnswer(); // 쉼표 없이 저장된 사용자 답안 문자열
        List<Question> incorrectQuestions = new ArrayList<>();

        for (int i = 0; i < questions.size(); i++) {
            Question question = questions.get(i);
            if (i < userAnswers.length()) { // 사용자 답안 길이 내에서 접근 가능할 경우
                char userAnswer = userAnswers.charAt(i);
                if (!question.getRightAnswer().equals(String.valueOf(userAnswer))) {
                    incorrectQuestions.add(question); // 틀린 경우 문제 추가
                }
            }
        }

        return incorrectQuestions;
    }

    // useAnswer과 question을 비교해서 맞는 문제를 가지고 오는 서비스
    public List<Question> getCorrectQuestions(Long id, String userId, String yearAndMonth) {
        // 시험지 데이터 가져오기
        Optional<Test> testOptional = testRepository.findByIdAndUserIdAndYearAndMonth(id, userId, yearAndMonth);
        if (testOptional.isEmpty()) {
            return new ArrayList<>(); // 시험지를 찾지 못하면 빈 리스트 반환
        }
        Test test = testOptional.get();

        // 질문 데이터 가져오기
        String[] ym = yearAndMonth.split("-");
        String year = ym[0];
        String month = ym[1];
        List<Question> questions = questionRepository.findAllByYearAndMonth(year, month);

        // 사용자 답안 문자열을 인덱스 별로 비교
        String userAnswers = test.getUserAnswer(); // 쉼표 없이 저장된 사용자 답안 문자열
        List<Question> correctQuestions = new ArrayList<>();

        for (int i = 0; i < questions.size(); i++) {
            Question question = questions.get(i);
            if (i < userAnswers.length()) { // 사용자 답안 길이 내에서 접근 가능할 경우
                char userAnswer = userAnswers.charAt(i);
                if (question.getRightAnswer().equals(String.valueOf(userAnswer))) {
                    correctQuestions.add(question); // 맞은 경우 문제 추가
                }
            }
        }

        return correctQuestions;
    }

    // 문제별 유형 맞은 개수 반환 서비스
    public Map<String, Integer> getCorrectQuestionsAndCounts(Long id, String userId, String yearAndMonth) {
        // 시험지 데이터 가져오기
        Optional<Test> testOptional = testRepository.findByIdAndUserIdAndYearAndMonth(id, userId, yearAndMonth);
        if (testOptional.isEmpty()) {
            return new HashMap<>(); // 시험지를 찾지 못하면 빈 Map 반환
        }
        Test test = testOptional.get();

        // 질문 데이터 가져오기
        String[] ym = yearAndMonth.split("-");
        String year = ym[0];
        String month = ym[1];
        List<Question> questions = questionRepository.findAllByYearAndMonth(year, month);

        // 사용자 답안 문자열을 인덱스별로 비교
        String userAnswers = test.getUserAnswer(); // 쉼표 없이 저장된 사용자 답안 문자열

        // 카운트 초기화
        int graspCount = 0; // 대의 파악
        int grammarCount = 0; // 문법, 어휘
        int understandingCount = 0; // 상황 이해(일치, 불일치)
        int blankCount = 0; // 빈칸 추론
        int indirectCount = 0; // 간접 쓰기
        int compositeCount = 0; // 복합 문제

        for (int i = 0; i < questions.size(); i++) {
            Question question = questions.get(i);
            if (i < userAnswers.length()) { // 사용자 답안 길이 내에서 접근 가능할 경우
                char userAnswer = userAnswers.charAt(i);
                if (question.getRightAnswer().equals(String.valueOf(userAnswer))) { // 정답일 경우
                    int questionNumber = Integer.parseInt(question.getNumber());

                    // 번호별로 카운트 증가
                    if (questionNumber >= 18 && questionNumber <= 24 && questionNumber != 21) {
                        graspCount++;
                    } else if (questionNumber == 21 || questionNumber == 29 || questionNumber == 30) {
                        grammarCount++;
                    } else if (questionNumber >= 25 && questionNumber <= 28) {
                        understandingCount++;
                    } else if (questionNumber >= 31 && questionNumber <= 34) {
                        blankCount++;
                    } else if (questionNumber >= 35 && questionNumber <= 40) {
                        indirectCount++;
                    } else if (questionNumber >= 41 && questionNumber <= 45) {
                        compositeCount++;
                    }
                }
            }
        }

        // 카운트를 Map으로 반환
        Map<String, Integer> counts = new HashMap<>();
        counts.put("graspCount", graspCount);
        counts.put("grammarCount", grammarCount);
        counts.put("understandingCount", understandingCount);
        counts.put("blankCount", blankCount);
        counts.put("indirectCount", indirectCount);
        counts.put("compositeCount", compositeCount);

        return counts;
    }



    @Transactional
    public Test saveTest(Test test) {
        return testRepository.save(test); // 변경된 데이터를 저장
    }


}

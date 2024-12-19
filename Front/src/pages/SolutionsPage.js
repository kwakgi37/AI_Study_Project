//SolutionsPage.js

import React, { useEffect, useState, useContext, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import ProblemBox from '../components/Problem_Box';
import QuestionInfoBox from '../components/QuestionInfoBox';
import { useParams } from 'react-router-dom';
import { fetchQuestions, fetchRecentTest, fetchIncorrectQuestions } from '../api/questionsApi';
import { AuthContext } from '../context/AuthContext';
import './SolutionsPage.css';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './QuestionAnimation.css'; // 애니메이션 스타일 정의


function SolutionsPage() {
  const { year, month } = useParams(); // URL에서 연도와 월을 가져옵니다.
  const { user } = useContext(AuthContext); // 사용자 인증 정보를 가져옵니다.
  const [questionData, setQuestionData] = useState([]); // 문제 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 현재 문제 인덱스
  const [testResult, setTestResult] = useState(null); // 최신 시험 결과 데이터
  const [incorrectQuestions, setIncorrectQuestions] = useState([]); // 틀린 문제 데이터
  const testIdRef = useRef(null); // 동적으로 설정되는 testId를 저장하기 위한 ref
  const [direction, setDirection] = useState('forward'); // 방향 상태 추가

  const userId = user?.userId; // 사용자 ID를 가져옵니다.
  const yearAndMonth = `${year}-${month}`; // 연도와 월을 조합한 문자열

  useEffect(() => {
    const loadQuestionsAndTestResult = async () => {
      try {
        if (!userId) {
          setError('사용자 정보가 없습니다. 로그인 후 다시 시도해주세요.');
          return;
        }

        setLoading(true);

        // 문제 데이터를 가져옵니다.
        const allQuestions = await fetchQuestions(year, month);
        setQuestionData(allQuestions);
        console.log("문제 데이터:", allQuestions);

        // 최신 시험 결과 데이터를 가져옵니다.
        const testResultData = await fetchRecentTest(userId, yearAndMonth);
        setTestResult(testResultData);
        testIdRef.current = testResultData?.id; // 최신 시험 결과의 ID를 저장합니다.
        console.log("최신 시험 결과 데이터:", testResultData);

        // 틀린 문제 데이터를 가져옵니다.
        if (testIdRef.current) {
          const incorrectData = await fetchIncorrectQuestions(testIdRef.current, userId, yearAndMonth);
          setIncorrectQuestions(incorrectData);
          console.log("틀린 문제 데이터:", incorrectData);
        } else {
          console.warn("최신 시험의 ID를 찾을 수 없습니다.");
        }
      } catch (error) {
        setError('데이터를 불러오는 중 문제가 발생했습니다.');
        console.error("데이터 로드 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestionsAndTestResult();
  }, [year, month, userId, yearAndMonth]);

  const currentQuestion = questionData[currentQuestionIndex]; // 현재 문제
  const isLastQuestion = currentQuestionIndex === questionData.length - 1; // 마지막 문제인지 여부
  const currentAnswer = testResult?.userAnswer?.[currentQuestionIndex] || ''; // 현재 문제의 사용자 답안
  const totalScore = testResult?.score || 0; // 총점

  const handleNextQuestion = () => {
    setDirection('forward'); // 애니메이션 방향 설정
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questionData.length - 1));
  };

  const handlePreviousQuestion = () => {
    setDirection('backward'); // 애니메이션 방향 설정
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  if (!testResult && !loading) {
    return (
      <div className="problems-container">
        <Sidebar />
        <div className="content-wrapper">
        
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Typography variant="h4" color="error">
              시험을 풀고 오세요.
            </Typography>
          </Box>
        </div>
      </div>
    );
  }

  return (
    <div className="solutions-container">
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-area">
          <Box className="solution-main-box">
            <QuestionInfoBox
              year={year}
              month={month}
              currentQuestion={currentQuestion}
              time={0}
              currentQuestionIndex={currentQuestionIndex}
              isLastQuestion={isLastQuestion}
              handlePreviousQuestion={handlePreviousQuestion}
              handleNextQuestion={handleNextQuestion}
              mode="solution" // O/X 결과 표시
              isSolutionPage={true}
              userId={userId}
              yearAndMonth={yearAndMonth}
              questionData={questionData}
              incorrectQuestions={incorrectQuestions}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
              totalScore={totalScore}
            />
  
            {loading ? (
              <Typography>문제 데이터를 불러오는 중입니다...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <div className="problem-box-container">
                <SwitchTransition>
                  <CSSTransition
                    key={currentQuestionIndex} // 애니메이션 트리거 키
                    classNames={`slide-${direction}`} // forward 또는 backward 방향
                    timeout={300} // 애니메이션 시간
                  >
                    <div>
                      <ProblemBox
                        customClass="custom-solutions-style"
                        questionData={currentQuestion}
                        showAnswerField={false} // 답 입력 필드 표시
                        showExplanation={true} // 해설 표시
                        userAnswer={currentAnswer}
                        showUserAnswer={true}
                      />
                    </div>
                  </CSSTransition>
                </SwitchTransition>
              </div>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
}  

export default SolutionsPage;

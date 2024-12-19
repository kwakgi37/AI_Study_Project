//QuestionsPage.js

import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './QuestionAnimation.css'; // 애니메이션 스타일 정의
import ProblemBox from '../components/Problem_Box';
import ScoreModal from '../components/ScoreModal';
import QuestionInfoBox from '../components/QuestionInfoBox';
import { useParams } from 'react-router-dom';
import { fetchQuestions, submitAnswers } from '../api/questionsApi';
import { AuthContext } from '../context/AuthContext';
import useQuestionStorage from '../hooks/useQuestionStorage';
import './QuestionsPage.css';


function QuestionsPage() {
  const { user } = useContext(AuthContext);
  const { year, month } = useParams();
  const [questionData, setQuestionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [direction, setDirection] = useState('forward');

  const userId = user?.userId || 'guest'; // 사용자 ID를 가져옵니다. 없으면 'guest'로 처리
  

  // 사용자 ID와 시험 정보를 포함한 키로 로컬 스토리지 상태 관리
  const { 
    currentQuestionIndex, 
    setCurrentQuestionIndex, 
    elapsedTime, 
    setElapsedTime, 
    answers, 
    setAnswers, 
    clearStorageData 
  } = useQuestionStorage(user?.userId, `${year}-${month}`);
  
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const allQuestions = await fetchQuestions(year, month);

        if (allQuestions.length > 0) {
          setQuestionData(allQuestions);
        } else {
          setError('No questions found for the selected year and month.');
        }
      } catch (error) {
        setError('Failed to load question data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [year, month]);

  const handleNextQuestion = () => {
  setDirection('forward');
  setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questionData.length - 1));
};

const handlePreviousQuestion = () => {
  setDirection('backward');
  setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
};

  const handleAnswerChange = (newAnswer) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: newAnswer,
    });
  };

  const handleComplete = async () => {
    const answerArray = questionData.map((_, index) => answers[index] || 'X');

    try {
      const response = await submitAnswers(userId, year, month, answerArray, elapsedTime);

      setScoreData({
        userId,
        year,
        month,
        correctAnswers: response.correctCount,
        incorrectAnswers: response.wrongCount,
        totalScore: response.totalScore,
        timeTaken: elapsedTime,
      });
      setIsScoreModalOpen(true);

      clearStorageData(); // 저장 데이터 초기화
    } catch (error) {
      console.error('답안 제출 오류:', error);
      alert(`답안 제출에 실패했습니다: ${error.message}`);
    }
  };

  const currentQuestion = questionData[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex] || '';
  const isLastQuestion = currentQuestionIndex === questionData.length - 1;

  if (!loading && (!questionData || questionData.length === 0)) {
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
    <div className="problems-container">
      <Sidebar />
      <div className="content-wrapper">
        {/* <TopNav isAuthenticated={!!user} user={user} /> */}
        <div className="content-area">
          <Box className="problem-main-box">
            <QuestionInfoBox
              year={year}
              month={month}
              currentQuestion={currentQuestion}
              onComplete={handleComplete}
              time={elapsedTime}
              currentQuestionIndex={currentQuestionIndex}
              isLastQuestion={isLastQuestion}
              handlePreviousQuestion={() => {
                setDirection('backward'); // 방향 설정
                handlePreviousQuestion();
              }}
              handleNextQuestion={() => {
                setDirection('forward'); // 방향 설정
                handleNextQuestion();
              }}
              isSolutionPage={false}
              mode="question" // 사용자 답안 표시
              isQuestionPage={true}
              questionData={questionData} // 문제 데이터를 넘겨줌 (추가됨)
              answers={answers} // 사용자가 작성한 답안을 넘겨줌 (추가됨)
              setCurrentQuestionIndex={setCurrentQuestionIndex} // 문제 번호 클릭 시 이동을 위한 함수 전달 (추가됨)
            />
  
            {loading ? (
              <Typography>Loading question data...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <div className="problem-box-container">
                <SwitchTransition>
                  <CSSTransition
                    key={currentQuestionIndex} // 애니메이션이 인덱스 변경에 따라 트리거
                    classNames={`slide-${direction}`} // forward 또는 backward 방향
                    timeout={300} // 애니메이션 시간
                  >
                    <div>
                      <ProblemBox
                        customClass="custom-problem-style"
                        isQuestionPage={true}
                        questionData={currentQuestion}
                        initialAnswer={currentAnswer}
                        onAnswerChange={handleAnswerChange}
                        isLastQuestion={isLastQuestion}
                        onComplete={handleComplete}
                        onTimeUpdate={setElapsedTime}
                        showAnswerField={true} // 답 입력 필드 표시
                        showExplanation={false} // 해설 표시
                      />
                      
                    </div>
                  </CSSTransition>
                </SwitchTransition>
              </div>
            )}
          </Box>
        </div>
      </div>
  
      {scoreData && (
        <ScoreModal open={isScoreModalOpen} onClose={() => setIsScoreModalOpen(false)} scoreData={scoreData} />
      )}
    </div>
  );
}

export default QuestionsPage;

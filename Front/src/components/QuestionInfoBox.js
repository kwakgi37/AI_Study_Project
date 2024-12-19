import React, { useState, useContext } from 'react';
import { Box, Typography, Button, IconButton, Modal } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuIcon from '@mui/icons-material/Menu';
import ComparisonTable from './ComparisonTable';
import './QuestionInfoBox.css';
import { useNavigate } from 'react-router-dom';
import { ImageContext } from '../context/ImageContext';
import { similarProblem } from '../api/chatGPTApi';

const QuestionInfoBox = ({
  year,
  month,
  currentQuestion,
  time,
  currentQuestionIndex,
  isLastQuestion,
  handlePreviousQuestion,
  handleNextQuestion,
  totalScore,
  isQuestionPage = false,
  isSolutionPage = false,
  questionData = [],
  incorrectQuestions = [],
  answers = {}, // 사용자 답안 (QuestionsPage용)
  setCurrentQuestionIndex,
  mode = 'question', // 페이지 타입 구분 ('question' 또는 'solution')
  hideMenuIcon, // 기존 메뉴 아이콘 숨기기
  hideTime = false, // 학습 시간 숨기기
  showAnswerField = true,
  initialAnswer = '',
  onComplete,
  alwaysShowCompleteButton = false,
  onAnswerChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { setImageUrl } = useContext(ImageContext);

  // 비슷한 유형 문제 호출 함수
  const handleSimilarProblem = async () => {
    try {
      const imageElement = document.querySelector('img'); // 페이지 내 이미지 요소 선택
      const currentImageUrl = imageElement ? imageElement.src : null; // 이미지 URL 가져오기

      if (currentImageUrl) {
        const imageFile = await fetch(currentImageUrl).then((res) => res.blob());
        const result = await similarProblem(imageFile);
        console.log('비슷한 문제:', result);

        setImageUrl(currentImageUrl);
        navigate('/analysis'); // Analysis 페이지로 이동
      } else {
        alert('이미지가 없습니다.');
      }
    } catch (error) {
      console.error('비슷한 유형 문제 요청 실패:', error);
      alert('비슷한 유형 문제를 가져오는 데 실패했습니다.');
    }
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  // ComparisonTable에 전달할 데이터 설정
  const tableData = {
    incorrectQuestionNumbers: incorrectQuestions.map((q) => q.number),
    answers, // 사용자 답안
  };

  // 현재 문제 번호가 틀린 문제 목록에 있는지 확인
  const isIncorrect = incorrectQuestions.some((q) => q.number === currentQuestion?.number);

  return (
    <Box className="question-info-box">
      <Typography variant="h6" className="left-text">
        {currentQuestion ? (
          <>
            {year}년 {month}월 {currentQuestion.number}번 문제
          </>
        ) : (
          '시험 정보를 불러오는 중...'
        )}
      </Typography>

      {isSolutionPage && (
        <Box display="flex" alignItems="center">
          <Typography variant="h6" className="score-text">
            총점: {totalScore}점
          </Typography>
        </Box>
      )}

      {isSolutionPage && (
        <Box display="flex" alignItems="center">
          <Typography
            className={`result-text ${isIncorrect ? 'incorrect' : 'correct'}`}
            variant="h3"
          >
            {isIncorrect ? '오답입니다.' : '정답입니다.'}
          </Typography>
        </Box>
      )}

      {!isQuestionPage && (
        <Button variant="contained" color="primary" onClick={handleSimilarProblem}>
          비슷한 유형 문제 풀기
        </Button>
      )}

      {!isSolutionPage && !hideTime && (
        <Typography variant="h6" className="center-text">
          학습 시간 : {`${Math.floor(time / 3600)}시간 ${Math.floor((time % 3600) / 60)}분 ${time % 60}초`}
        </Typography>
      )}

      {(isLastQuestion || alwaysShowCompleteButton) && (
        <Button
          variant="contained"
          className="complete-button"
          onClick={onComplete}
          size="small"
        >
          완료
        </Button>
      )}



      <Box className="button-box">
        {!hideMenuIcon && (
          <IconButton onClick={toggleModal} className="nav-button">
            <MenuIcon />
          </IconButton>
        )}
        <Button onClick={handlePreviousQuestion} className="nav-button" disabled={currentQuestionIndex === 0}>
          <ArrowBackIcon />
        </Button>
        <Button onClick={handleNextQuestion} className="nav-button" disabled={isLastQuestion}>
          <ArrowForwardIcon />
        </Button>
      </Box>

      <Modal open={isModalOpen} onClose={toggleModal}>
        <Box style={{ padding: 20, backgroundColor: 'white', margin: '50px auto', maxWidth: '600px' }}>
          <ComparisonTable
            questionData={questionData}
            incorrectQuestionNumbers={tableData.incorrectQuestionNumbers}
            answers={tableData.answers}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            mode={mode} // 'question' 또는 'solution' 전달
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default QuestionInfoBox;

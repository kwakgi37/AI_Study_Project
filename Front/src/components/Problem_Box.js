//Problem_Box.js

import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import './Problem_Box.css';

const ProblemBox = ({
  customClass,
  questionData,
  showAnswerField = true, // 답 입력 필드 표시 여부
  showExplanation = false, // 해설 표시 여부
  onAnswerChange,
  initialAnswer = '',
  isLastQuestion,
  onComplete,
  userAnswer,
  showUserAnswer = false,
  alwaysShowCompleteButton = false, // 항상 완료 버튼 표시 여부
  withToggleExplanation = false, // 해설 보기 버튼 활성화 여부
  isQuestionPage = false,
}) => {
  const [answer, setAnswer] = useState(initialAnswer);
  const [showExplanationContent, setShowExplanationContent] = useState(!withToggleExplanation); // 해설 보이기 상태

  // 문제 변경 시 초기 답안 세팅
  useEffect(() => {
    setAnswer(initialAnswer);
  }, [initialAnswer]);

  // 답안 입력 처리 함수
  const handleInputChange = (event) => {
    const newAnswer = event.target.value;
    setAnswer(newAnswer);
    if (onAnswerChange) onAnswerChange(newAnswer); // 상위 컴포넌트로 답안 전달
  };

  // 해설 보기 토글 함수
  const toggleExplanation = () => {
    setShowExplanationContent((prev) => !prev);
  };

  return (
    <Box className={`problemArea ${customClass}`}>
      <Box className="problemBox">
        {/* 문제 이미지와 답 입력 필드 */}
        <Box className="imageContainer">
          {/* 문제 이미지 */}
          <img src={questionData.text} alt="문제 이미지" className="questionImage" />
        </Box>
        {isQuestionPage && showAnswerField && (
          <Box>
            <TextField
              variant="outlined"
              placeholder="답을 입력하세요"
              size="small"
              className="answer-input"
              value={answer}
              onChange={handleInputChange}
            />
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
          </Box>
        )}
      </Box>

      {/* 해설 보기 버튼 */}
      {withToggleExplanation && questionData.description && (
        <Box mt={2} textAlign="center">
          <Button
            variant="outlined"
            size="small"
            onClick={toggleExplanation}
            className="toggle-explanation-button"
          >
            {showExplanationContent ? '해설 숨기기' : '해설 보기'}
          </Button>
        </Box>
      )}

      {/* 해설(설명) 박스 */}
      {showExplanation && showExplanationContent && questionData.description && (
        <Box mt={2} className="explanationBox">
          <Typography variant="body2">{questionData.description}</Typography>

          {/* 사용자 답안 */}
          {showUserAnswer && userAnswer && (
            <Box mt={2} display="flex" >
              <Typography variant="body1" style={{ color: 'black' }}>
                사용자 답안: {userAnswer}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProblemBox;

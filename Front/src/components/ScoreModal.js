import React from 'react';
import { Box, Typography, Button, Modal, Backdrop, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './ScoreModal.css'; // CSS 파일을 import

const ScoreModal = ({ open, onClose, scoreData }) => {
  const { userId, year, month, totalScore = 0} = scoreData; // 필요한 데이터와 number 기본값
  const navigate = useNavigate();

  // 대시보드로 이동하는 함수
  const handleGoToDashboard = () => {
    onClose();
    navigate('/'); // 대시보드 경로로 이동
  };

  // 문제 해설 화면으로 이동하는 함수
  const handleGoToSolutionScreen = () => {
    onClose();
    navigate(`/solutions/${year}/${month}`); // number 값을 동적으로 전달
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box className="score-modal-box">
          <Typography variant="h4" gutterBottom>성적 결과</Typography>
          <Typography variant="h6">사용자 ID: {userId}</Typography>
          <Typography variant="h6">연도 및 월: 20{year}년 / {month}월</Typography>
          <Typography variant="h6">총 점수: {totalScore}점</Typography>

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="secondary" onClick={handleGoToDashboard}>
              대시보드로 이동
            </Button>
            <Button variant="contained" color="primary" onClick={handleGoToSolutionScreen}>
              문제 해설 화면
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ScoreModal;

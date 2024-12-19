import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    navigate('/'); // 메인 페이지로 이동
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          로그인이 필요합니다
        </Typography>
        <Typography variant="body2" gutterBottom>
          접근하려는 페이지는 로그인 후에 이용하실 수 있습니다.
        </Typography>
        <Button variant="contained" onClick={handleClose}>
          닫기
        </Button>
      </Box>
    </Modal>
  );
}

export default LoginModal;

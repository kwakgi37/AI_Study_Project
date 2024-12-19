import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/authApi';
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';

function Signup() {
  const [userId, setuserId] = useState('');
  const [email, setEmail] = useState('');
  const [userPw, setuserPw] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // 유효성 검사 추가
    if (userId.length < 4) {
      setMessage('아이디는 최소 4자 이상이어야 합니다.');
      return;
    }

    if (userPw !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
      return;
    }

    try {
      const response = await signup({ userId, email, userPw });
      console.log('회원가입 성공:', response);
      setMessage('회원가입이 성공적으로 완료되었습니다!');
      navigate('/login'); // 회원가입 성공 시 로그인 페이지로 이동
    } catch (error) {
      console.error('회원가입 실패:', error.message);
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8} p={4} boxShadow={3} borderRadius={2} sx={{ backgroundColor: '#FFFFFF'}}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          회원가입
        </Typography>
        <form onSubmit={handleSignup}>
          <Box mb={3}>
            <TextField
              fullWidth
              label="아이디"
              variant="outlined"
              value={userId}
              onChange={(e) => setuserId(e.target.value)}
              required
            />
          </Box>
          <Box mb={3}>
            <TextField
              fullWidth
              label="이메일"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Box>
          <Box mb={3}>
            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              variant="outlined"
              value={userPw}
              onChange={(e) => setuserPw(e.target.value)}
              required
            />
          </Box>
          <Box mb={3}>
            <TextField
              fullWidth
              label="비밀번호 확인"
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Box>
          <Box textAlign="center">
            <Button type="submit" variant="contained" color="primary" size="large">
              회원가입
            </Button>
          </Box>
        </form>
        {message && (
          <Box mt={3}>
            <Alert severity={message.includes('성공') ? 'success' : 'error'}>{message}</Alert>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Signup;

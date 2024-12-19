// authApi.js
import axiosInstance from './axiosInstance';

// 회원가입 API 호출 함수
export const signup = async (userData) => {
  try {
    const response = await axiosInstance.post('/signup', userData);
    return response.data;
  } catch (error) {
    throw new Error('회원가입에 실패했습니다.');
  }
};

// 로그인 API 호출 함수
export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post('/login', credentials);
    console.log('로그인 API 응답:', response.data); // 응답 데이터 출력
    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,

      user: {
        userId: response.data.userId,
        email: response.data.email,
      },
    };
  } catch (error) {
    if (error.response) {
      // 서버에서 응답이 있는 경우
      console.error('로그인 API 요청 실패:', error.response.data);
      throw new Error(error.response.data.message || '로그인에 실패했습니다.');
    } else if (error.request) {
      // 요청은 보내졌지만 응답이 없는 경우 (네트워크 문제 등)
      console.error('서버 응답 없음:', error.request);
      throw new Error('서버와 연결할 수 없습니다.');
    } else {
      // 요청 설정 중에 오류 발생
      console.error('요청 설정 오류:', error.message);
      throw new Error('요청 설정 중 오류가 발생했습니다.');
    }
  }
  
};

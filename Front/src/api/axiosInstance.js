// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 설정 - 요청마다 Authorization 헤더 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 인터셉터 설정 함수
export const setupAxiosInterceptors = (logout, refreshAccessToken) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // 401 오류 처리
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // 토큰 갱신 시도
          const success = await refreshAccessToken();

          if (success) {
            // 갱신된 토큰을 로컬 스토리지에서 가져와 Authorization 헤더에 추가
            const newToken = localStorage.getItem('token');
            if (newToken) {
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            }

            // 갱신 성공 로그 출력
            console.log('[토큰 갱신 성공] 새로운 액세스 토큰으로 요청을 재시도합니다.');

            // 요청 재시도
            return axiosInstance(originalRequest);
          } else {
            // 갱신 실패 시 로그아웃
            logout();
            console.log('[토큰 갱신 실패] 로그아웃이 수행되었습니다.');
          }
        } catch (refreshError) {
          console.error('토큰 갱신 중 오류 발생:', refreshError.message);
          // 서버와의 통신 오류 등 예외 상황 처리
          if (refreshError.response && refreshError.response.status === 401) {
            console.warn('리프레시 토큰이 만료되었거나 유효하지 않습니다. 로그아웃 처리됩니다.');
          } else {
            console.error('서버와의 통신 오류로 토큰 갱신에 실패하였습니다.');
          }
          logout();
        }
      }

      // 다른 오류는 그대로 반환
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, signup as apiSignup } from '../api/authApi';
import axiosInstance, { setupAxiosInterceptors } from '../api/axiosInstance';
import {jwtDecode} from 'jwt-decode';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const { saveItem, getItem, removeItem } = useLocalStorage();

  const getCurrentTimeInSeconds = () => Math.floor(Date.now() / 1000);

  const isTokenValid = useCallback((token) => {
    if (!token) return false;
    try {
      const { exp } = jwtDecode(token);
      return exp > getCurrentTimeInSeconds();
    } catch (error) {
      console.error('토큰 디코딩 실패:', error.message);
      return false;
    }
  }, []);

  const [user, setUser] = useState(() => getItem('user', null));
  const [token, setToken] = useState(() => getItem('token', ''));
  const [refreshToken, setRefreshToken] = useState(() => getItem('refreshToken', ''));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      const { accessToken, refreshToken, user, year, month } = response;

      if (!accessToken || !refreshToken || !user) {
        throw new Error('유효하지 않은 로그인 응답입니다.');
      }

      setUser(user);
      setToken(accessToken);
      setRefreshToken(refreshToken);

      // Month와 Year가 응답에 포함되지 않은 경우 기본값 설정
      const currentYear = year || new Date().getFullYear().toString().slice(2); // 두 자리 연도로 변환
      const currentMonth = month || (new Date().getMonth() + 1).toString().padStart(2, '0'); // 두 자리 월

      // 로컬 스토리지에 저장
      saveItem('token', accessToken);
      saveItem('refreshToken', refreshToken);
      saveItem('user', user);
      saveItem('lastSelectedYear', currentYear);
      saveItem('lastSelectedMonth', currentMonth);

      setIsAuthenticated(true);

      // 로그인 성공 시 로컬 스토리지 데이터 콘솔 출력
      console.log('로그인 성공: 로컬 스토리지 데이터', {
        user: getItem('user'),
        token: getItem('token'),
        refreshToken: getItem('refreshToken'),
        lastSelectedYear: getItem('lastSelectedYear'),
        lastSelectedMonth: getItem('lastSelectedMonth'),
      });
    } catch (error) {
      console.error('로그인 실패:', error.message);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      await apiSignup(userData);
    } catch (error) {
      console.error('회원가입 실패:', error.message);
      throw error;
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken('');
    setRefreshToken('');
    removeItem('token');
    removeItem('refreshToken');
    removeItem('user');
    removeItem('lastSelectedYear');
    removeItem('lastSelectedMonth');
    setIsAuthenticated(false);
    console.log('사용자가 로그아웃 되었습니다');
  }, [removeItem]);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken || !token) return false;
    try {
      const response = await axiosInstance.post('/refresh', {
        refreshToken,
        accessToken: token,
      });

      const { accessToken: newAccessToken, user } = response.data;

      console.log('새로운 액세스 토큰을 받아왔습니다.', newAccessToken);
      setToken(newAccessToken);
      saveItem('token', newAccessToken);

      if (user) {
        setUser(user);
        saveItem('user', user);
        console.log('사용자 정보를 업데이트했습니다.', user);
      }

      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('토큰 갱신 실패:', error.message);
      if (error.response && error.response.status === 401) {
        console.warn('RefreshToken이 만료되었습니다. 로그아웃 처리됩니다.');
      }
      logout();
      return false;
    }
  }, [refreshToken, token, logout, saveItem]);

  useEffect(() => {
    setupAxiosInterceptors(logout, refreshAccessToken);

    const initializeAuth = async () => {
      const token = getItem('token'); // 로컬 스토리지에서 토큰 가져오기
      if (isTokenValid(token) && user) {
        setIsAuthenticated(true);
        console.log('사용자가 로그인 되었습니다.');
      } else {
        logout();
      }
      setIsLoading(false); // 인증 초기화 후 로딩 상태 변경
    };
    initializeAuth();
  }, [getItem, isTokenValid, user, logout, refreshAccessToken]);

  useEffect(() => {
    if (!token) return;

    const { exp } = jwtDecode(token);
    const timeUntilExpiry = exp - getCurrentTimeInSeconds();

    const timeoutId = setTimeout(() => {
      refreshAccessToken();
    }, (timeUntilExpiry - 60) * 1000);

    return () => clearTimeout(timeoutId);
  }, [token, refreshAccessToken]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, token, login, logout, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// src/hooks/useLocalStorage.js

import { useCallback } from 'react';

// 로컬 스토리지에 데이터를 저장하는 함수
export const useLocalStorage = () => {
  const saveItem = useCallback((key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error saving data to localStorage for key "${key}":`, error);
    }
  }, []);

  // 로컬 스토리지에서 데이터를 가져오는 함수
  const getItem = useCallback((key, defaultValue = null) => {
    try {
      const serializedValue = localStorage.getItem(key);
      return serializedValue ? JSON.parse(serializedValue) : defaultValue;
    } catch (error) {
      console.error(`Error retrieving data from localStorage for key "${key}":`, error);
      return defaultValue;
    }
  }, []);

  // 로컬 스토리지에서 특정 데이터를 삭제하는 함수
  const removeItem = useCallback((key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing data from localStorage for key "${key}":`, error);
    }
  }, []);

  // 모든 로컬 스토리지 관련 함수 반환
  return { saveItem, getItem, removeItem };
};

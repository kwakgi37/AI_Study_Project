import { useState } from 'react';

// 로컬 스토리지에 데이터를 저장하고 불러오는 커스텀 훅
export const useSolutionStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // 로컬 스토리지에서 값 가져오기
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      // 로컬 스토리지에 값 저장
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
  };

  return [storedValue, setValue];
};

import { useState, useEffect, useRef } from 'react';

// 로컬 스토리지에서 현재 경과 시간을 가져오는 함수
const getElapsedTime = (testId) => {
  return parseInt(localStorage.getItem(`${testId}_elapsedTime`) || '0', 10);
};

const getCurrentQuestionIndex = (testId) => {
  return parseInt(localStorage.getItem(`${testId}_currentQuestionIndex`) || '0', 10);
};

const getStoredAnswers = (testId) => {
  const savedAnswers = localStorage.getItem(`${testId}_answers`);
  return savedAnswers ? JSON.parse(savedAnswers) : {};
};

// 커스텀 훅 정의
function useQuestionStorage(userId, testId) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() =>
    getCurrentQuestionIndex(testId)
  );
  const [elapsedTime, setElapsedTime] = useState(() => getElapsedTime(testId));
  const [answers, setAnswers] = useState(() => getStoredAnswers(testId));
  const timerRef = useRef(null);

  // 페이지가 로드되거나 컴포넌트가 마운트될 때 타이머 시작
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime((prevTime) => {
        const newTime = prevTime + 1;
        localStorage.setItem(`${testId}_elapsedTime`, newTime);
        return newTime;
      });
    }, 1000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      clearInterval(timerRef.current);
    };
  }, [testId]);

  // 경과 시간이나 현재 문제 번호를 페이지를 떠나기 전에 저장
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem(`${testId}_elapsedTime`, elapsedTime);
      localStorage.setItem(`${testId}_currentQuestionIndex`, currentQuestionIndex);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [elapsedTime, currentQuestionIndex, testId]);

  // 문제 인덱스가 변경될 때 저장
  useEffect(() => {
    localStorage.setItem(`${testId}_currentQuestionIndex`, currentQuestionIndex);
  }, [currentQuestionIndex, testId]);

  // 답변이 변경될 때 저장
  useEffect(() => {
    localStorage.setItem(`${testId}_answers`, JSON.stringify(answers));
  }, [answers, testId]);

  // 저장된 데이터를 초기화하고 타이머를 멈추는 함수
  const clearStorageData = () => {
    localStorage.clear();
  };

  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    elapsedTime,
    setElapsedTime,
    answers,
    setAnswers,
    clearStorageData,
  };
}

export default useQuestionStorage;

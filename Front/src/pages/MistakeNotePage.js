//MistakeNotePage.js

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { AuthContext } from '../context/AuthContext';
import { fetchRecentTest, fetchIncorrectQuestions, fetchQuestions } from '../api/questionsApi';
import './MistakeNotePage.css';

function MistakeNotePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = user?.userId;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        if (!userId) {
          setError('사용자 정보가 없습니다. 로그인 후 다시 시도해주세요.');
          return;
        }

        setLoading(true);

        const yearMonthPairs = [
          { year: 24, month: 9 },
          { year: 23, month: 9 },
        ];

        const categoryPromises = yearMonthPairs.map(async ({ year, month }) => {
          const yearAndMonth = `${year}-${month}`;

          const questions = await fetchQuestions(year, month).catch((err) => {
            console.warn(`No questions found for ${yearAndMonth}`, err);
            return []; // 질문이 없을 경우 빈 배열 반환
          });

          const testResultData = await fetchRecentTest(userId, yearAndMonth).catch((err) => {
            console.warn(`No test result found for ${yearAndMonth}`, err);
            return null; // 시험 결과가 없을 경우 null 반환
          });

          const fetchedTestId = testResultData?.id;
          if (!fetchedTestId) {
            return null; // 시험을 푸지 않은 경우
          }

          const incorrectQuestions = await fetchIncorrectQuestions(fetchedTestId, userId, yearAndMonth).catch((err) => {
            console.warn(`No incorrect questions found for ${yearAndMonth}`, err);
            return []; // 오답 데이터가 없을 경우 빈 배열 반환
          });

          const incorrectDetails = incorrectQuestions.map((incorrect) => {
            const question = questions.find((q) => q.number === incorrect.number);
            return {
              ...question,
              userAnswer: incorrect.userAnswer,
              isCorrect: false,
            };
          });

          return {
            year,
            month,
            testId: fetchedTestId, // 최신 테스트 ID 추가
            incorrectQuestions: incorrectDetails,
            score: testResultData.score,
          };
        });

        const categoriesData = (await Promise.all(categoryPromises)).filter((category) => category !== null); // null 필터링
        setCategories(categoriesData);

        if (categoriesData.length === 0) {
          setError('문제를 풀고 오세요.');
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        setError('데이터를 불러오는 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [userId]);

  const handleCategoryClick = (year, month, testId, incorrectDetails, score) => {
    navigate(`/mistake/solutions/${year}/${month}`, {
      state: { testId, incorrectDetails, score },
    });
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
      
        <Container sx={{ mt: 4, ml: 2 }}>
          <Box sx={{ backgroundColor: '#FFFFFF', padding: 2, width: '1610px', height: '890px' }}>
            <Box textAlign="center" mt={4}>
            
            <Typography variant="h4" gutterBottom>
              오답노트
            </Typography>
            <Typography variant="body1">틀린 문제를 다시 풀어보세요.</Typography>
            
          </Box>
          {loading ? (
            <Typography>Loading categories...</Typography>
          ) : error ? (
            <Typography variant="h6" color="error" textAlign="center">
              {error}
            </Typography>
          ) : (
            <List>
              {categories.map(({ year, month, testId, incorrectQuestions, score }) => (
                <ListItem
                  key={`${year}-${month}`}
                  button
                  component="div"
                  onClick={() =>
                    handleCategoryClick(year, month, testId, incorrectQuestions, score)
                  }
                >
                  <ListItemText primary={`${year}년 ${month}월 모의고사`} />
                </ListItem>
              ))}
            </List>
          )}
          </Box>
        </Container>
      </div>
    </div>
  );
}

export default MistakeNotePage;

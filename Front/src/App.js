//App.js

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MainPage from './pages/MainPage';
import { AuthProvider } from './context/AuthContext';
import { ImageProvider } from './context/ImageContext'; // ImageProvider import 추가
import theme from './theme';
import QuestionsPage from './pages/QuestionsPage';
import PrivateRoute from './components/PrivateRoute';
import AnalysisPage from './pages/AnalysisPage';
import HistoryPage from './pages/HistoryPage';
import SolutionsPage from './pages/SolutionsPage';
import MistakeNotePage from './pages/MistakeNotePage';
import MistakeSolutionsPage from './pages/MistakeSolutionsPage'; // 새로운 페이지 추가

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ImageProvider> {/* ImageProvider import 및 사용 */}
          <Router>
            <Routes>
              {/* 공개 라우트 */}
              <Route path="/" element={<MainPage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />

              {/* 인증이 필요한 라우트 */}
              <Route element={<PrivateRoute />}>
                <Route path="/questions/:year/:month" element={<QuestionsPage />} />
                <Route path="/analysis" element={<AnalysisPage />} />
                <Route path="/history" element={<HistoryPage />} />

                {/* 문제 풀이 */}
                <Route path="/solutions/:year/:month" element={<SolutionsPage />} />

                {/* 오답 문제 풀이 */}
                <Route path="/mistake/:year/:month" element={<MistakeNotePage />} />
                <Route path="/mistake/solutions/:year/:month/" element={<MistakeSolutionsPage />} />
              </Route>
            </Routes>
          </Router>
        </ImageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

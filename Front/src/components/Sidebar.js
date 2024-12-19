//SideBar.js

import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import {FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import useQuestionStorage from '../hooks/useQuestionStorage';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useContext(AuthContext); // user 정보를 참조

  const { clearStorageData } = useQuestionStorage();

  const isActive = (path) => location.pathname === path;

  const [sidebarHeight, setSidebarHeight] = useState(window.innerHeight);

  // 스크롤 및 윈도우 리사이즈 이벤트 핸들러
  const updateSidebarHeight = () => {
    setSidebarHeight(document.body.scrollHeight);
  };

  useEffect(() => {
    // 스크롤 및 윈도우 리사이즈 이벤트 등록
    window.addEventListener('scroll', updateSidebarHeight);
    window.addEventListener('resize', updateSidebarHeight);

    // 초기 높이 설정
    updateSidebarHeight();

    // 컴포넌트 언마운트 시 이벤트 제거
    return () => {
      window.removeEventListener('scroll', updateSidebarHeight);
      window.removeEventListener('resize', updateSidebarHeight);
    };
  }, []);

  const handleLogoutClick = () => {
    console.log(`로그인 before data (${user?.userId || user?.email || 'Unknown User'}):`, {
      currentQuestionIndex: localStorage.getItem('currentQuestionIndex'),
      elapsedTime: localStorage.getItem('elapsedTime'),
      answers: localStorage.getItem('answers'),
      lastSelectedYear: localStorage.getItem('lastSelectedYear'),
      lastSelectedMonth: localStorage.getItem('lastSelectedMonth'),
      lastSelectedNumber: localStorage.getItem('lastSelectedNumber'),
    });

    clearStorageData(); // 로컬 스토리지 데이터 초기화
    logout(); // AuthContext의 로그아웃 호출

    console.log(`로그인 after data (${user?.id || user?.userId || 'Unknown User'}):`, {
      currentQuestionIndex: localStorage.getItem('currentQuestionIndex'),
      elapsedTime: localStorage.getItem('elapsedTime'),
      answers: localStorage.getItem('answers'),
      lastSelectedYear: localStorage.getItem('lastSelectedYear'),
      lastSelectedMonth: localStorage.getItem('lastSelectedMonth'),
      lastSelectedNumber: localStorage.getItem('lastSelectedNumber'),
    });

    navigate('/'); // 메인 페이지로 이동
  };

  const handleLoginClick = () => {
    navigate('/login'); // 로그인 페이지로 이동
  };

  const [lastYear, setLastYear] = useState(localStorage.getItem('lastSelectedYear'));
  const [lastMonth, setLastMonth] = useState(localStorage.getItem('lastSelectedMonth'));
  

  useEffect(() => {
    const storedYear = localStorage.getItem('lastSelectedYear');
    const storedMonth = localStorage.getItem('lastSelectedMonth');

    setLastYear(storedYear);
    setLastMonth(storedMonth);
  }, [location]);

  const questionsPath = `/questions/${lastYear}/${lastMonth}`;
  const solutionsPath = `/solutions/${lastYear}/${lastMonth}`;
  const mistakePath = `/mistake/${lastYear}/${lastMonth}`;

  return (
    <div className="sidebar" style={{ height: `${sidebarHeight}px` }}>
      <h3 className="sidebar-title">Service</h3>
      <ul className="sidebar-section">
        <li className={isActive('/') ? 'active' : ''}>
          <Link to="/" className="sidebar-link">홈</Link>
        </li>
        <li className={isActive(questionsPath) ? 'active' : ''}>
          <Link to={questionsPath} className="sidebar-link">문제풀이</Link>
        </li>
        <li className={isActive(solutionsPath) ? 'active' : ''}>
          <Link to={solutionsPath} className="sidebar-link">문제해설</Link>
        </li>
        <li className={isActive(mistakePath) ? 'active' : ''}>
          <Link to={mistakePath} className="sidebar-link">오답노트</Link>
        </li>
        <li className={isActive('/analysis') ? 'active' : ''}>
          <Link to="/analysis" className="sidebar-link">비슷한 유형 문제풀기</Link>
        </li>
        <li className={isActive('/history') ? 'active' : ''}>
          <Link to="/history" className="sidebar-link">학습 기록</Link>
        </li>
      </ul>

      <div className="logout-section">
        {isAuthenticated ? (
          <button className="logout-button" onClick={handleLogoutClick}>
            <FaSignOutAlt className="sidebar-icon" /> 로그아웃
          </button>
        ) : (
          <button className="logout-button" onClick={handleLoginClick}>
            <FaSignInAlt className="sidebar-icon" /> 로그인
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

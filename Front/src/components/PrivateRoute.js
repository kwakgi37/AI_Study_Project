import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const location = useLocation();

  // 로딩 중일 때 로딩 화면을 표시
  if (isLoading) {
    return <div>로딩 중...</div>; // 로딩 상태를 표시 (커스텀 UI로 변경 가능)
  }

  // 인증되지 않은 경우 로그인 페이지로 이동
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 인증된 경우 자식 라우트를 렌더링
  return <Outlet />;
};

export default PrivateRoute;

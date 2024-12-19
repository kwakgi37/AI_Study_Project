//TopNav.js

import React from 'react';
import { IconButton, Typography } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import './TopNav.css';

const TopNav = ({ isAuthenticated, user }) => {
  return (
    <div className="topnav">
      {/* 로그인 상태에 따른 환영 메시지 표시 */}
      {isAuthenticated ? (
        <Typography variant="h6" style={{ marginLeft: '16px' }}>
          환영합니다, {user?.userId || '사용자'}님!
        </Typography>
      ) : (
        <Typography variant="h6" style={{ marginLeft: '16px' }}>
          환영합니다! 로그인해 주세요.
        </Typography>
      )}

      {/* 오른쪽 아이콘들 */}
      <div className="topnav-right">
        <IconButton>
          <SettingsIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default TopNav;

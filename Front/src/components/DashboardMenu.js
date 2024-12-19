// DashboardMenu.js
import React, { useState } from 'react';
import { Typography, Collapse, List, ListItem, ListItemButton, ListItemText, Box } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './DashboardMenu.css';

const DashboardMenu = () => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    <div className="dashboard-menu">
      <div className="dashboard-header" onClick={handleToggle}>
        <Typography variant="h6" className="dashboard-text">
          Dashboard
        </Typography>
        <ExpandMoreIcon
          className={`expand-icon ${expanded ? 'expanded' : ''}`}
          style={{ color: '#3366ff', marginLeft: '5px' }}
        />
      </div>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box className="dropdown-overlay">
          <List className="dashboard-list">
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/problems">
                <ListItemText primary="문제풀이 화면" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/solutions">
                <ListItemText primary="문제 해설 화면" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/retry">
                <ListItemText primary="문제 다시 풀기 화면" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/analysis">
                <ListItemText primary="분석 or 피드백 화면" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/history">
                <ListItemText primary="학습 기록" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/comparison">
                <ListItemText primary="친구와 성적 비교" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/etc">
                <ListItemText primary="기타" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Collapse>
    </div>
  );
};

export default DashboardMenu;

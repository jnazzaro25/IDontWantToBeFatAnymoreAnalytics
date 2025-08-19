import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  History as HistoryIcon,
  ShowChart as ShowChartIcon,
  Layers as LayersIcon,
  MonitorWeight as MonitorWeightIcon
} from '@mui/icons-material';

const Navigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <AddIcon />, label: 'Add Workout' },
    { path: '/previous-workouts', icon: <HistoryIcon />, label: 'Previous Workouts' },
    { path: '/lift-metrics', icon: <ShowChartIcon />, label: 'Lift Metrics' },
    { path: '/templates', icon: <LayersIcon />, label: 'Templates' },
    { path: '/weight-tracker', icon: <MonitorWeightIcon />, label: 'Weight Tracker' }
  ];

  const handleTabChange = (event, newValue) => {
    // Navigation is handled by React Router, this is just for the tab indicator
  };

  const getCurrentTabIndex = () => {
    return navItems.findIndex(item => item.path === location.pathname);
  };

  if (isMobile) {
    return (
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            💪 Workout Tracker
          </Typography>
        </Toolbar>
        <Tabs
          value={getCurrentTabIndex()}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            backgroundColor: 'background.paper',
            '& .MuiTab-root': {
              minHeight: 56,
              minWidth: 'auto',
              px: 2,
            },
            '& .MuiTab-labelIcon': {
              minHeight: 56,
            }
          }}
        >
          {navItems.map((item, index) => (
            <Tab
              key={item.path}
              icon={item.icon}
              label={item.label}
              component={NavLink}
              to={item.path}
              sx={{
                color: 'text.secondary',
                '&.active': {
                  color: 'primary.main',
                },
                '&:hover': {
                  color: 'primary.main',
                }
              }}
            />
          ))}
        </Tabs>
      </AppBar>
    );
  }

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            💪 Workout Tracker
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Track your workouts, progress, and body composition
          </Typography>
        </Box>
        
        <Tabs
          value={getCurrentTabIndex()}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              minWidth: 'auto',
              px: 3,
              py: 1,
              borderRadius: 2,
              mx: 0.5,
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            },
            '& .MuiTab-labelIcon': {
              minHeight: 64,
            }
          }}
        >
          {navItems.map((item, index) => (
            <Tab
              key={item.path}
              icon={item.icon}
              label={item.label}
              component={NavLink}
              to={item.path}
              sx={{
                color: 'text.secondary',
                '&.active': {
                  color: 'primary.main',
                  backgroundColor: 'primary.50',
                },
                '&:hover': {
                  color: 'primary.main',
                }
              }}
            />
          ))}
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { AppThemeProvider } from './design-system/theme.js';
import Navigation from './components/Navigation';
import WorkoutTracker from './components/WorkoutTracker';
import PreviousWorkouts from './components/PreviousWorkouts';
import LiftMetrics from './components/LiftMetrics';
import WorkoutTemplates from './components/WorkoutTemplates';
import WeightTracker from './components/WeightTracker';

function App() {
  return (
    <AppThemeProvider>
      <Router>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <Navigation />
          <Container 
            maxWidth="xl" 
            sx={{ 
              py: 3,
              px: { xs: 2, sm: 3, md: 4 }
            }}
          >
            <Routes>
              <Route path="/" element={<WorkoutTracker />} />
              <Route path="/previous-workouts" element={<PreviousWorkouts />} />
              <Route path="/lift-metrics" element={<LiftMetrics />} />
              <Route path="/templates" element={<WorkoutTemplates />} />
              <Route path="/weight-tracker" element={<WeightTracker />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </AppThemeProvider>
  );
}

export default App;

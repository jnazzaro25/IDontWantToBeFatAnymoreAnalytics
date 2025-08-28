import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  Alert,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Whatshot as FireIcon,
  FitnessCenter as FitnessCenterIcon,
  Repeat as RepeatIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const LiftMetrics = () => {
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [exerciseData, setExerciseData] = useState([]);
  const [performanceSummary, setPerformanceSummary] = useState(null);
  const [insights, setInsights] = useState([]);

  const analyzeExercise = useCallback(() => {
    if (!selectedExercise) return;

    const exerciseWorkouts = allWorkouts.filter(workout =>
      workout.exercises.some(exercise => exercise.name === selectedExercise)
    );

    const data = exerciseWorkouts.map(workout => {
      const exercise = workout.exercises.find(ex => ex.name === selectedExercise);
      const maxWeight = Math.max(...exercise.sets.map(set => set.weight));
      const totalVolume = exercise.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
      const avgReps = exercise.sets.reduce((sum, set) => sum + set.reps, 0) / exercise.sets.length;
      
      // Calculate estimated 1RM using Epley formula: weight * (1 + reps/30)
      const oneRepMaxes = exercise.sets.map(set => {
        if (set.reps === 1) return set.weight;
        return set.weight * (1 + set.reps / 30);
      });
      const estimatedOneRepMax = Math.max(...oneRepMaxes);
      
      return {
        date: workout.date,
        maxWeight,
        totalVolume,
        avgReps,
        sets: exercise.sets.length,
        estimatedOneRepMax: Math.round(estimatedOneRepMax),
        notes: exercise.notes
      };
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    setExerciseData(data);
    calculatePerformanceSummary(data);
    generateInsights(data);
  }, [selectedExercise, allWorkouts]);

  useEffect(() => {
    loadWorkoutsFromCSV();
  }, []);

  useEffect(() => {
    analyzeExercise();
  }, [analyzeExercise]);

  const loadWorkoutsFromCSV = async () => {
    try {
      // Load saved workouts from localStorage (saved via the save workout button)
      const storedWorkouts = localStorage.getItem('saved_workouts');
      let workoutData = [];
      
      if (storedWorkouts) {
        workoutData = JSON.parse(storedWorkouts);
      }

      // Also load repository CSV data if available
      const repoCSVData = localStorage.getItem('repo_csv_data');
      if (repoCSVData) {
        const csvRows = JSON.parse(repoCSVData);
        
        // Convert CSV rows back to workout format
        const csvWorkouts = {};
        
        csvRows.forEach(row => {
          const [date, exerciseName, exerciseType, sets, reps, weight, duration, distance, notes, workoutId] = row;
          
          if (!csvWorkouts[workoutId]) {
            csvWorkouts[workoutId] = {
              id: workoutId,
              date: date,
              exercises: []
            };
          }
          
          // Find or create exercise in this workout
          let exercise = csvWorkouts[workoutId].exercises.find(ex => ex.name === exerciseName);
          if (!exercise) {
            exercise = {
              name: exerciseName,
              type: exerciseType,
              sets: exerciseType === 'strength' ? [] : undefined,
              duration: exerciseType === 'cardio' ? duration : undefined,
              distance: exerciseType === 'cardio' ? distance : undefined,
              notes: notes
            };
            csvWorkouts[workoutId].exercises.push(exercise);
          }
          
          // Add set data for strength exercises
          if (exerciseType === 'strength' && sets && reps && weight) {
            exercise.sets.push({
              weight: parseInt(weight) || 0,
              reps: parseInt(reps) || 0
            });
          }
        });
        
        // Convert to array and merge with existing workouts
        const csvWorkoutArray = Object.values(csvWorkouts);
        
        // Merge without duplicates (prefer localStorage workouts over CSV)
        const existingIds = new Set(workoutData.map(w => w.id));
        csvWorkoutArray.forEach(csvWorkout => {
          if (!existingIds.has(csvWorkout.id)) {
            workoutData.push(csvWorkout);
          }
        });
      }

      // Also check for any workout templates or current exercises that might have been used
      // This ensures we can analyze data even if user hasn't used the save button yet
      const currentExercises = localStorage.getItem('workout_exercises');
      if (currentExercises && workoutData.length === 0) {
        // Create a temporary workout from current exercises for analysis
        const exercises = JSON.parse(currentExercises);
        if (exercises.length > 0) {
          const today = new Date().toISOString().split('T')[0];
          const tempWorkout = {
            id: 'temp_' + Date.now(),
            date: today,
            exercises: exercises.filter(ex => ex.type === 'strength' && ex.sets && ex.sets.length > 0)
          };
          if (tempWorkout.exercises.length > 0) {
            workoutData = [tempWorkout];
          }
        }
      }
      
      setAllWorkouts(workoutData);
    } catch (error) {
      console.error('Error loading workout data:', error);
      setAllWorkouts([]);
    }
  };

  const calculatePerformanceSummary = (data) => {
    if (data.length < 2) return;

    const firstWorkout = data[0];
    const lastWorkout = data[data.length - 1];
    
    const weightChange = lastWorkout.maxWeight - firstWorkout.maxWeight;
    const volumeChange = lastWorkout.totalVolume - firstWorkout.totalVolume;
    const repsChange = lastWorkout.avgReps - firstWorkout.avgReps;
    const oneRepMaxChange = lastWorkout.estimatedOneRepMax - firstWorkout.estimatedOneRepMax;
    
    const weightTrend = weightChange > 0 ? 'positive' : weightChange < 0 ? 'negative' : 'stable';
    const volumeTrend = volumeChange > 0 ? 'positive' : volumeChange < 0 ? 'negative' : 'stable';
    const repsTrend = repsChange > 0 ? 'positive' : repsChange < 0 ? 'negative' : 'stable';
    const oneRepMaxTrend = oneRepMaxChange > 0 ? 'positive' : oneRepMaxChange < 0 ? 'negative' : 'stable';

    setPerformanceSummary({
      weightChange: weightChange > 0 ? `+${weightChange}` : weightChange.toString(),
      volumeChange: volumeChange > 0 ? `+${volumeChange}` : volumeChange.toString(),
      repsChange: repsChange > 0 ? `+${repsChange.toFixed(1)}` : repsChange.toFixed(1),
      oneRepMaxChange: oneRepMaxChange > 0 ? `+${oneRepMaxChange}` : oneRepMaxChange.toString(),
      weightTrend,
      volumeTrend,
      repsTrend,
      oneRepMaxTrend,
      totalWorkouts: data.length,
      dateRange: `${firstWorkout.date} to ${lastWorkout.date}`,
      currentOneRepMax: lastWorkout.estimatedOneRepMax
    });
  };

  const generateInsights = (data) => {
    if (data.length < 2) return;

    const insights = [];
    
    // Weight progression insight
    const weightProgress = data[data.length - 1].maxWeight - data[0].maxWeight;
    if (weightProgress > 0) {
      insights.push({
        type: 'positive',
        icon: TrendingUpIcon,
        text: `You've increased your max weight by ${weightProgress} lbs!`
      });
    } else if (weightProgress < 0) {
      insights.push({
        type: 'warning',
        icon: TrendingDownIcon,
        text: `Your max weight has decreased by ${Math.abs(weightProgress)} lbs. Consider deloading or checking form.`
      });
    }

    // Consistency insight
    const consistentWorkouts = data.filter(workout => workout.sets >= 3).length;
    const consistencyRate = (consistentWorkouts / data.length) * 100;
    if (consistencyRate >= 80) {
      insights.push({
        type: 'positive',
        icon: FireIcon,
        text: `Great consistency! You're hitting ${consistencyRate.toFixed(0)}% of your target sets.`
      });
    } else {
      insights.push({
        type: 'info',
        icon: FitnessCenterIcon,
        text: `Consider aiming for more consistent set completion (currently ${consistencyRate.toFixed(0)}%).`
      });
    }

    // Volume insight
    const avgVolume = data.reduce((sum, workout) => sum + workout.totalVolume, 0) / data.length;
    const lastVolume = data[data.length - 1].totalVolume;
    if (lastVolume > avgVolume) {
      insights.push({
        type: 'positive',
        icon: FitnessCenterIcon,
        text: `Your latest workout volume (${lastVolume} lbs) is above your average (${avgVolume.toFixed(0)} lbs).`
      });
    }

    setInsights(insights);
  };

  const getUniqueExercises = () => {
    const exercises = new Set();
    allWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (exercise.type === 'strength') {
          exercises.add(exercise.name);
        }
      });
    });
    return Array.from(exercises).sort();
  };

  const chartData = {
    maxWeight: {
      labels: exerciseData.map(entry => entry.date),
      datasets: [{
        label: 'Max Weight (lbs)',
        data: exerciseData.map(entry => entry.maxWeight),
        borderColor: '#2B94FF',
        backgroundColor: 'rgba(43, 148, 255, 0.1)',
        tension: 0.1,
        fill: true
      }]
    },
    volume: {
      labels: exerciseData.map(entry => entry.date),
      datasets: [{
        label: 'Total Volume (lbs)',
        data: exerciseData.map(entry => entry.totalVolume),
        borderColor: '#FF9500',
        backgroundColor: 'rgba(255, 149, 0, 0.1)',
        tension: 0.1,
        fill: true
      }]
    },
    reps: {
      labels: exerciseData.map(entry => entry.date),
      datasets: [{
        label: 'Average Reps',
        data: exerciseData.map(entry => entry.avgReps),
        borderColor: '#9C27B0',
        backgroundColor: 'rgba(156, 39, 176, 0.1)',
        tension: 0.1,
        fill: true
      }]
    },
    oneRepMax: {
      labels: exerciseData.map(entry => entry.date),
      datasets: [{
        label: 'Estimated 1RM (lbs)',
        data: exerciseData.map(entry => entry.estimatedOneRepMax),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.1,
        fill: true,
        pointBackgroundColor: '#4CAF50',
        pointBorderColor: '#4CAF50',
        pointBorderWidth: 2,
        pointRadius: 5
      }]
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Performance Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Value'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom color="primary">
            Lift Metrics Analysis
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Exercise to Analyze</InputLabel>
                <Select
                  value={selectedExercise}
                  onChange={(e) => setSelectedExercise(e.target.value)}
                  label="Select Exercise to Analyze"
                >
                  <MenuItem value="">
                    <em>Choose an exercise...</em>
                  </MenuItem>
                  {getUniqueExercises().map(exercise => (
                    <MenuItem key={exercise} value={exercise}>{exercise}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {selectedExercise && exerciseData.length > 0 && (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom color="primary">
                Performance Summary
              </Typography>
              {performanceSummary && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Weight Change
                      </Typography>
                      <Typography 
                        variant="h6" 
                        color={performanceSummary.weightTrend === 'positive' ? 'success.main' : 
                               performanceSummary.weightTrend === 'negative' ? 'error.main' : 'text.primary'}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
                      >
                        {performanceSummary.weightTrend === 'positive' ? <TrendingUpIcon /> : 
                         performanceSummary.weightTrend === 'negative' ? <TrendingDownIcon /> : null}
                        {performanceSummary.weightChange} lbs
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Volume Change
                      </Typography>
                      <Typography 
                        variant="h6" 
                        color={performanceSummary.volumeTrend === 'positive' ? 'success.main' : 
                               performanceSummary.volumeTrend === 'negative' ? 'error.main' : 'text.primary'}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
                      >
                        {performanceSummary.volumeTrend === 'positive' ? <TrendingUpIcon /> : 
                         performanceSummary.volumeTrend === 'negative' ? <TrendingDownIcon /> : null}
                        {performanceSummary.volumeChange} lbs
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Reps Change
                      </Typography>
                      <Typography 
                        variant="h6" 
                        color={performanceSummary.repsTrend === 'positive' ? 'success.main' : 
                               performanceSummary.repsTrend === 'negative' ? 'error.main' : 'text.primary'}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
                      >
                        {performanceSummary.repsTrend === 'positive' ? <TrendingUpIcon /> : 
                         performanceSummary.repsTrend === 'negative' ? <TrendingDownIcon /> : null}
                        {performanceSummary.repsChange}
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        1RM Change
                      </Typography>
                      <Typography 
                        variant="h6" 
                        color={performanceSummary.oneRepMaxTrend === 'positive' ? 'success.main' : 
                               performanceSummary.oneRepMaxTrend === 'negative' ? 'error.main' : 'text.primary'}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
                      >
                        {performanceSummary.oneRepMaxTrend === 'positive' ? <TrendingUpIcon /> : 
                         performanceSummary.oneRepMaxTrend === 'negative' ? <TrendingDownIcon /> : null}
                        {performanceSummary.oneRepMaxChange} lbs
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Current 1RM
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {performanceSummary.currentOneRepMax} lbs
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Total Workouts
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {performanceSummary.totalWorkouts}
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Date Range
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {performanceSummary.dateRange}
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom color="primary">
                Performance Insights
              </Typography>
              <Grid container spacing={2}>
                {insights.map((insight, index) => (
                  <Grid item xs={12} key={index}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        backgroundColor: insight.type === 'positive' ? 'success.light' : 
                                       insight.type === 'negative' ? 'error.light' : 'info.light',
                        color: insight.type === 'positive' ? 'success.contrastText' : 
                               insight.type === 'negative' ? 'error.contrastText' : 'info.contrastText'
                      }}
                    >
                      <insight.icon />
                      <Typography variant="body1">{insight.text}</Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom color="primary">
                Progress Charts
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FitnessCenterIcon />
                      One Rep Max (1RM) Progress
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Estimated using Epley formula: Weight × (1 + Reps ÷ 30)
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <Line data={chartData.oneRepMax} options={chartOptions} />
                    </Box>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Max Weight Progress
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <Line data={chartData.maxWeight} options={chartOptions} />
                    </Box>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Volume Progress
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <Line data={chartData.volume} options={chartOptions} />
                    </Box>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Reps Progress
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <Line data={chartData.reps} options={chartOptions} />
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom color="primary">
                Workout Details
              </Typography>
              <Grid container spacing={2}>
                {exerciseData.map((entry, index) => (
                  <Grid item xs={12} key={index}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        {entry.date}
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6} sm={2.4}>
                          <Chip 
                            icon={<FitnessCenterIcon />} 
                            label={`Max: ${entry.maxWeight} lbs`} 
                            size="small" 
                            variant="outlined"
                            color="primary"
                          />
                        </Grid>
                        <Grid item xs={6} sm={2.4}>
                          <Chip 
                            icon={<TrendingUpIcon />} 
                            label={`1RM: ${entry.estimatedOneRepMax} lbs`} 
                            size="small" 
                            variant="outlined"
                            color="success"
                          />
                        </Grid>
                        <Grid item xs={6} sm={2.4}>
                          <Chip 
                            icon={<FireIcon />} 
                            label={`Volume: ${entry.totalVolume} lbs`} 
                            size="small" 
                            variant="outlined"
                            color="secondary"
                          />
                        </Grid>
                        <Grid item xs={6} sm={2.4}>
                          <Chip 
                            icon={<RepeatIcon />} 
                            label={`Avg Reps: ${entry.avgReps.toFixed(1)}`} 
                            size="small" 
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6} sm={2.4}>
                          <Chip 
                            icon={<FitnessCenterIcon />} 
                            label={`Sets: ${entry.sets}`} 
                            size="small" 
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                      {entry.notes && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <CalendarIcon fontSize="small" />
                          <Typography variant="body2">{entry.notes}</Typography>
                        </Box>
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
          </>
        )}

      {selectedExercise && exerciseData.length === 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <TrendingUpIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No data available for {selectedExercise}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try selecting a different exercise or add more workouts.
            </Typography>
          </CardContent>
        </Card>
      )}

      {!selectedExercise && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <TrendingUpIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Exercise Analysis
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Select an exercise above to view detailed metrics and progress analysis.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default LiftMetrics;

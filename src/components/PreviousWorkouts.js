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
  InputLabel,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
  Badge
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  FitnessCenter as FitnessCenterIcon,
  DirectionsRun as DirectionsRunIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const PreviousWorkouts = () => {
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [timeRange, setTimeRange] = useState('all');

  const filterWorkouts = useCallback(() => {
    let filtered = [...allWorkouts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(workout => 
        workout.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.exercises.some(exercise => 
          exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exercise.notes.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Exercise filter
    if (selectedExercise) {
      filtered = filtered.filter(workout =>
        workout.exercises.some(exercise => 
          exercise.name.toLowerCase().includes(selectedExercise.toLowerCase())
        )
      );
    }

    // Time range filter
    if (timeRange !== 'all') {
      const daysAgo = parseInt(timeRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      
      filtered = filtered.filter(workout => 
        new Date(workout.date) >= cutoffDate
      );
    }

    setFilteredWorkouts(filtered);
  }, [allWorkouts, searchTerm, selectedExercise, timeRange]);

  useEffect(() => {
    loadRealWorkoutData();
  }, []);

  useEffect(() => {
    filterWorkouts();
  }, [filterWorkouts]);

  const loadRealWorkoutData = () => {
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
              exercises: [],
              totalDuration: 0,
              notes: ''
            };
          }
          
          // Find or create exercise in this workout
          let exercise = csvWorkouts[workoutId].exercises.find(ex => ex.name === exerciseName);
          if (!exercise) {
            exercise = {
              name: exerciseName,
              type: exerciseType,
              sets: exerciseType === 'strength' ? [] : undefined,
              duration: exerciseType === 'cardio' ? parseInt(duration) || 0 : undefined,
              distance: exerciseType === 'cardio' ? parseFloat(distance) || 0 : undefined,
              notes: notes || ''
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

      // Sort workouts by date (newest first)
      workoutData.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setAllWorkouts(workoutData);
    } catch (error) {
      console.error('Error loading workout data:', error);
      setAllWorkouts([]);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedExercise('');
    setTimeRange('all');
  };

  const exportToCSV = () => {
    if (filteredWorkouts.length === 0) {
      alert('No workouts to export!');
      return;
    }

    const headers = ['Date', 'Exercise Name', 'Type', 'Set Number', 'Weight (lbs)', 'Reps', 'Duration (min)', 'Distance (miles)', 'Notes', 'Workout Notes'];
    const csvRows = [headers.join(',')];

    filteredWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (exercise.type === 'strength' && exercise.sets) {
          exercise.sets.forEach((set, index) => {
            const row = [
              workout.date,
              exercise.name,
              exercise.type,
              index + 1,
              set.weight || '',
              set.reps || '',
              '',
              '',
              `"${exercise.notes || ''}"`,
              `"${workout.notes || ''}"`
            ];
            csvRows.push(row.join(','));
          });
        } else {
          const row = [
            workout.date,
            exercise.name,
            exercise.type,
            '',
            '',
            '',
            exercise.duration || '',
            exercise.distance || '',
            `"${exercise.notes || ''}"`,
            `"${workout.notes || ''}"`
          ];
          csvRows.push(row.join(','));
        }
      });
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const timestamp = format(new Date(), 'yyyy-MM-dd');
    const filename = `workout_history_${timestamp}.csv`;
    
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculateWorkoutStats = (workout) => {
    let totalSets = 0;
    let totalReps = 0;
    let totalWeight = 0;
    let totalDuration = 0;
    let totalDistance = 0;

    workout.exercises.forEach(exercise => {
      if (exercise.type === 'strength' && exercise.sets) {
        totalSets += exercise.sets.length;
        exercise.sets.forEach(set => {
          totalReps += parseInt(set.reps) || 0;
          totalWeight += parseFloat(set.weight) || 0;
        });
      } else {
        totalDuration += exercise.duration || 0;
        totalDistance += exercise.distance || 0;
      }
    });

    return {
      totalSets,
      totalReps,
      totalWeight,
      totalDuration,
      totalDistance
    };
  };

  const getUniqueExercises = () => {
    const exercises = new Set();
    allWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercises.add(exercise.name);
      });
    });
    return Array.from(exercises).sort();
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom color="primary">
            Previous Workouts
          </Typography>
          
          {/* Search and Filter Controls */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search workouts, exercises, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Exercise Filter</InputLabel>
                <Select
                  value={selectedExercise}
                  onChange={(e) => setSelectedExercise(e.target.value)}
                  label="Exercise Filter"
                >
                  <MenuItem value="">All Exercises</MenuItem>
                  {getUniqueExercises().map(exercise => (
                    <MenuItem key={exercise} value={exercise}>{exercise}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  label="Time Range"
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="7">Last 7 Days</MenuItem>
                  <MenuItem value="30">Last 30 Days</MenuItem>
                  <MenuItem value="90">Last 90 Days</MenuItem>
                  <MenuItem value="365">Last Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={clearFilters}
                startIcon={<ClearIcon />}
                sx={{ height: '56px' }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>

          {/* Summary Statistics */}
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Total Workouts
                </Typography>
                <Typography variant="h6" color="primary">
                  {filteredWorkouts.length}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Total Minutes
                </Typography>
                <Typography variant="h6" color="secondary">
                  {filteredWorkouts.reduce((total, workout) => total + (workout.totalDuration || 0), 0)}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Total Exercises
                </Typography>
                <Typography variant="h6">
                  {filteredWorkouts.reduce((total, workout) => total + workout.exercises.length, 0)}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {filteredWorkouts.length === 0 ? (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <SearchIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No workouts found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              No workouts found matching your filters. Try adjusting your search criteria.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {filteredWorkouts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(workout => {
              const stats = calculateWorkoutStats(workout);
              return (
                <Card key={workout.id} variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" color="primary">
                          {format(new Date(workout.date), 'EEEE, MMMM dd, yyyy')}
                        </Typography>
                        {workout.totalDuration > 0 && (
                          <Typography variant="body2" color="text.secondary">
                            {workout.totalDuration} minutes
                          </Typography>
                        )}
                      </Box>
                      <Stack direction="row" spacing={1}>
                        {stats.totalSets > 0 && (
                          <Chip
                            size="small"
                            label={`${stats.totalSets} sets, ${stats.totalReps} reps`}
                            color="primary"
                            variant="outlined"
                          />
                        )}
                        {stats.totalWeight > 0 && (
                          <Chip
                            size="small"
                            label={`${stats.totalWeight} lbs total`}
                            color="secondary"
                            variant="outlined"
                          />
                        )}
                        {stats.totalDistance > 0 && (
                          <Chip
                            size="small"
                            label={`${stats.totalDistance} miles`}
                            color="success"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                      {workout.exercises.map((exercise, index) => (
                        <Grid item xs={12} key={index}>
                          <Card variant="outlined" sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              {exercise.type === 'strength' ? 
                                <FitnessCenterIcon color="primary" /> : 
                                <DirectionsRunIcon color="secondary" />
                              }
                              <Typography variant="h6" component="h4">
                                {exercise.name}
                              </Typography>
                              <Chip 
                                size="small" 
                                label={exercise.type} 
                                color={exercise.type === 'strength' ? 'primary' : 'secondary'}
                                variant="outlined"
                              />
                            </Box>

                            {exercise.type === 'strength' && exercise.sets && exercise.sets.length > 0 && (
                              <Box sx={{ mb: 1 }}>
                                <Grid container spacing={1}>
                                  {exercise.sets.map((set, setIndex) => (
                                    <Grid item xs={6} sm={4} md={3} key={setIndex}>
                                      <Chip
                                        size="small"
                                        label={`Set ${setIndex + 1}: ${set.reps} reps @ ${set.weight} lbs`}
                                        variant="outlined"
                                        color="primary"
                                      />
                                    </Grid>
                                  ))}
                                </Grid>
                              </Box>
                            )}

                            {exercise.type === 'cardio' && (
                              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                {exercise.duration > 0 && (
                                  <Chip
                                    size="small"
                                    label={`Duration: ${exercise.duration} min`}
                                    color="secondary"
                                    variant="outlined"
                                  />
                                )}
                                {exercise.distance > 0 && (
                                  <Chip
                                    size="small"
                                    label={`Distance: ${exercise.distance} miles`}
                                    color="secondary"
                                    variant="outlined"
                                  />
                                )}
                              </Stack>
                            )}

                            {exercise.notes && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <FitnessCenterIcon fontSize="small" color="primary" />
                                <Typography variant="body2" color="text.secondary">
                                  {exercise.notes}
                                </Typography>
                              </Box>
                            )}
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    {workout.notes && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SearchIcon fontSize="small" color="info" />
                          <Typography variant="body2" color="info.contrastText">
                            <strong>Workout Notes:</strong> {workout.notes}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              );
            })}
        </Box>
      )}

      {filteredWorkouts.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Export Your Workout History
            </Typography>
            <Button
              variant="contained"
              color="success"
              onClick={exportToCSV}
              startIcon={<DownloadIcon />}
              size="large"
            >
              Export to CSV
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PreviousWorkouts;

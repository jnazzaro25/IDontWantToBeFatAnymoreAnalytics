import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Chip,
  Alert,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
  FitnessCenter as FitnessCenterIcon,
  DirectionsRun as DirectionsRunIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const WorkoutTracker = () => {
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'strength',
    numSets: 3,
    sets: [{ weight: '', reps: '' }],
    duration: '',
    distance: '',
    notes: ''
  });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [message, setMessage] = useState(null);

  const saveExercisesToStorage = useCallback(() => {
    localStorage.setItem('workout_exercises', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    loadExercisesFromStorage();
    checkForSelectedTemplate();
  }, []);

  useEffect(() => {
    saveExercisesToStorage();
  }, [saveExercisesToStorage]);

  const loadExercisesFromStorage = () => {
    const stored = localStorage.getItem('workout_exercises');
    if (stored) {
      setExercises(JSON.parse(stored));
    }
  };

  const checkForSelectedTemplate = () => {
    const stored = localStorage.getItem('selected_template');
    if (stored) {
      const template = JSON.parse(stored);
      setSelectedTemplate(template);
      setShowTemplateSelection(true);
      localStorage.removeItem('selected_template');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'type') {
      handleExerciseTypeChange(value);
    }
  };

  const handleExerciseTypeChange = (type) => {
    if (type === 'strength') {
      setFormData(prev => ({
        ...prev,
        type,
        numSets: 3,
        sets: [{ weight: '', reps: '' }],
        duration: '',
        distance: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        type,
        numSets: 0,
        sets: [],
        duration: '',
        distance: ''
      }));
    }
  };

  const handleNumSetsChange = (e) => {
    const numSets = parseInt(e.target.value);
    const sets = Array.from({ length: numSets }, (_, i) => 
      formData.sets[i] || { weight: '', reps: '' }
    );
    
    setFormData(prev => ({
      ...prev,
      numSets,
      sets
    }));
  };

  const handleSetChange = (index, field, value) => {
    const newSets = [...formData.sets];
    newSets[index] = { ...newSets[index], [field]: value };
    
    setFormData(prev => ({
      ...prev,
      sets: newSets
    }));
  };

  const addExercise = () => {
    if (!formData.name.trim()) {
      showMessage('Please enter an exercise name', 'error');
      return;
    }

    if (formData.type === 'strength') {
      if (formData.numSets < 1) {
        showMessage('Please enter number of sets', 'error');
        return;
      }
      if (formData.sets.some(set => !set.weight || !set.reps)) {
        showMessage('Please fill in all set details', 'error');
        return;
      }
    } else {
      if (!formData.duration && !formData.distance) {
        showMessage('Please enter duration or distance for cardio', 'error');
        return;
      }
    }

    const exercise = {
      id: Date.now() + Math.random(),
      name: formData.name.trim(),
      type: formData.type,
      sets: formData.type === 'strength' ? formData.sets : [],
      duration: formData.type === 'cardio' ? parseFloat(formData.duration) || 0 : 0,
      distance: formData.type === 'cardio' ? parseFloat(formData.distance) || 0 : 0,
      notes: formData.notes.trim(),
      timestamp: new Date().toISOString()
    };

    setExercises(prev => [...prev, exercise]);
    clearForm();
    showMessage('Exercise added successfully!', 'success');
  };

  const deleteExercise = (id) => {
    setExercises(prev => prev.filter(ex => ex.id !== id));
    showMessage('Exercise removed successfully!', 'success');
  };

  const clearForm = () => {
    setFormData({
      name: '',
      type: 'strength',
      numSets: 3,
      sets: [{ weight: '', reps: '' }],
      duration: '',
      distance: '',
      notes: ''
    });
  };

  const loadTemplateIntoWorkout = () => {
    if (!selectedTemplate || selectedTemplate.exercises.length === 0) {
      showMessage('No template to load!', 'error');
      return;
    }

    const templateExercises = selectedTemplate.exercises.map(templateExercise => ({
      id: Date.now() + Math.random(),
      name: templateExercise.name,
      type: templateExercise.type,
      sets: templateExercise.sets ? templateExercise.sets.map(set => ({
        weight: 0,
        reps: 0
      })) : [],
      duration: templateExercise.duration || 0,
      distance: templateExercise.distance || 0,
      notes: templateExercise.notes || '',
      timestamp: new Date().toISOString()
    }));

    setExercises(prev => [...prev, ...templateExercises]);
    clearSelectedTemplate();
    showMessage(`Template "${selectedTemplate.name}" loaded successfully!`, 'success');
  };

  const clearSelectedTemplate = () => {
    setSelectedTemplate(null);
    setShowTemplateSelection(false);
  };

  const generateCSV = () => {
    if (exercises.length === 0) {
      showMessage('No exercises to export!', 'error');
      return;
    }

    const headers = ['Exercise Name', 'Type', 'Set Number', 'Weight (lbs)', 'Reps', 'Duration (min)', 'Distance (miles)', 'Notes', 'Date'];
    const csvRows = [headers.join(',')];

    exercises.forEach(exercise => {
      if (exercise.type === 'strength' && exercise.sets.length > 0) {
        exercise.sets.forEach((set, index) => {
          const row = [
            exercise.name,
            exercise.type,
            index + 1,
            set.weight,
            set.reps,
            '',
            '',
            `"${exercise.notes}"`,
            format(new Date(exercise.timestamp), 'yyyy-MM-dd')
          ];
          csvRows.push(row.join(','));
        });
      } else {
        const row = [
          exercise.name,
          exercise.type,
          '',
          '',
          '',
          exercise.duration || '',
          exercise.distance || '',
          `"${exercise.notes}"`,
          format(new Date(exercise.timestamp), 'yyyy-MM-dd')
        ];
        csvRows.push(row.join(','));
      }
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const timestamp = format(new Date(), 'yyyy-MM-dd');
    const filename = `workout_${timestamp}.csv`;
    
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showMessage(`Exported ${exercises.length} exercises to ${filename}!`, 'success');
  };

  const clearWorkout = () => {
    if (exercises.length === 0) {
      showMessage('No workout to clear!', 'error');
      return;
    }

    if (window.confirm('Are you sure you want to clear this workout?')) {
      setExercises([]);
      showMessage('Workout cleared successfully!', 'success');
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const calculateSummary = () => {
    let totalExercises = exercises.length;
    let totalSets = 0;
    let totalReps = 0;
    let totalWeight = 0;
    let totalDuration = 0;
    let totalDistance = 0;

    exercises.forEach(exercise => {
      if (exercise.type === 'strength') {
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
      totalExercises,
      totalSets,
      totalReps,
      totalWeight,
      totalDuration,
      totalDistance
    };
  };

  const summary = calculateSummary();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Add New Exercise
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Exercise Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Bench Press, Running"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Exercise Type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
              </TextField>
            </Grid>

            {formData.type === 'strength' && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Number of Sets"
                  name="numSets"
                  value={formData.numSets}
                  onChange={handleNumSetsChange}
                  inputProps={{ min: 1, max: 10 }}
                  required
                />
              </Grid>
            )}

            {formData.type === 'cardio' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Duration (minutes)"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="30"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Distance (miles)"
                    name="distance"
                    value={formData.distance}
                    onChange={handleInputChange}
                    inputProps={{ step: 0.1 }}
                    placeholder="3.1"
                  />
                </Grid>
              </>
            )}
          </Grid>

          {formData.type === 'strength' && formData.numSets > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Set Details
              </Typography>
              <Grid container spacing={2}>
                {formData.sets.map((set, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          Set {index + 1}
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              placeholder="Weight (lbs)"
                              value={set.weight}
                              onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                              required
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              placeholder="Reps"
                              value={set.reps}
                              onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                              required
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="How did it feel? Any modifications?"
            />
          </Box>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addExercise}
              size="large"
            >
              Add Exercise
            </Button>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={clearForm}
              size="large"
            >
              Clear Form
            </Button>
          </Box>
        </CardContent>
      </Card>

      {showTemplateSelection && selectedTemplate && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Load Workout Template
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h6">{selectedTemplate.name}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {selectedTemplate.description}
                </Typography>
                <Chip 
                  label={`${selectedTemplate.day} • ${selectedTemplate.exercises.length} exercises`}
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<PlayIcon />}
                  onClick={loadTemplateIntoWorkout}
                >
                  Load Template
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={clearSelectedTemplate}
                >
                  Clear Template
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedTemplate.exercises.map((exercise, index) => (
                <Chip
                  key={index}
                  icon={exercise.type === 'strength' ? <FitnessCenterIcon /> : <DirectionsRunIcon />}
                  label={exercise.name}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {exercises.length > 0 && (
        <>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Today's Workout Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="h6" color="primary.main">
                      {summary.totalExercises}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Exercises
                    </Typography>
                  </Box>
                </Grid>
                {summary.totalSets > 0 && (
                  <>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                        <Typography variant="h6" color="secondary.main">
                          {summary.totalSets}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Sets
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                        <Typography variant="h6" color="info.main">
                          {summary.totalReps}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Reps
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                        <Typography variant="h6" color="success.main">
                          {summary.totalWeight} lbs
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Weight
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                )}
                {summary.totalDuration > 0 && (
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                      <Typography variant="h6" color="warning.main">
                        {summary.totalDuration} min
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Duration
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {summary.totalDistance > 0 && (
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                      <Typography variant="h6" color="info.main">
                        {summary.totalDistance} miles
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Distance
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Today's Exercises
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {exercises.map(exercise => (
                  <Card key={exercise.id} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {exercise.type === 'strength' ? <FitnessCenterIcon color="primary" /> : <DirectionsRunIcon color="secondary" />}
                          <Box>
                            <Typography variant="h6">
                              {exercise.name}
                            </Typography>
                            <Chip 
                              label={exercise.type} 
                              size="small" 
                              variant="outlined"
                              color={exercise.type === 'strength' ? 'primary' : 'secondary'}
                            />
                          </Box>
                        </Box>
                        <IconButton
                          onClick={() => deleteExercise(exercise.id)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>

                      {exercise.type === 'strength' && exercise.sets.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Sets:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {exercise.sets.map((set, index) => (
                              <Chip
                                key={index}
                                label={`Set ${index + 1}: ${set.reps} reps @ ${set.weight} lbs`}
                                variant="outlined"
                                size="small"
                              />
                            ))}
                          </Box>
                        </Box>
                      )}

                      {exercise.type === 'cardio' && (
                        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                          {exercise.duration > 0 && (
                            <Chip
                              icon={<DirectionsRunIcon />}
                              label={`Duration: ${exercise.duration} min`}
                              variant="outlined"
                              size="small"
                            />
                          )}
                          {exercise.distance > 0 && (
                            <Chip
                              icon={<DirectionsRunIcon />}
                              label={`Distance: ${exercise.distance} miles`}
                              variant="outlined"
                              size="small"
                            />
                          )}
                        </Box>
                      )}

                      {exercise.notes && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FitnessCenterIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {exercise.notes}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<DownloadIcon />}
                  onClick={generateCSV}
                  size="large"
                >
                  Export to CSV
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={clearWorkout}
                  size="large"
                >
                  Clear Workout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </>
      )}

      {message && (
        <Alert severity={message.type === 'error' ? 'error' : 'success'} sx={{ mt: 2 }}>
          {message.text}
        </Alert>
      )}
    </Box>
  );
};

export default WorkoutTracker;

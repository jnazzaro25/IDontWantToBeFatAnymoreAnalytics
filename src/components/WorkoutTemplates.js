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
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
  FitnessCenter as FitnessCenterIcon,
  DirectionsRun as DirectionsRunIcon
} from '@mui/icons-material';

const WorkoutTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState({
    name: '',
    description: '',
    day: '',
    exercises: []
  });
  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    type: 'strength',
    numSets: 3,
    sets: [{ weight: '', reps: '' }],
    duration: '',
    distance: '',
    notes: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const saveTemplatesToStorage = useCallback(() => {
    localStorage.setItem('workout_templates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    loadTemplatesFromStorage();
  }, []);

  useEffect(() => {
    saveTemplatesToStorage();
  }, [saveTemplatesToStorage]);

  const loadTemplatesFromStorage = () => {
    const stored = localStorage.getItem('workout_templates');
    if (stored) {
      setTemplates(JSON.parse(stored));
    }
  };

  const handleTemplateInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTemplate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExerciseInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentExercise(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'type') {
      handleExerciseTypeChange(value);
    }
  };

  const handleExerciseTypeChange = (type) => {
    if (type === 'strength') {
      setCurrentExercise(prev => ({
        ...prev,
        type,
        numSets: 3,
        sets: [{ weight: '', reps: '' }],
        duration: '',
        distance: ''
      }));
    } else {
      setCurrentExercise(prev => ({
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
      currentExercise.sets[i] || { weight: '', reps: '' }
    );
    
    setCurrentExercise(prev => ({
      ...prev,
      numSets,
      sets
    }));
  };

  const handleSetChange = (index, field, value) => {
    const newSets = [...currentExercise.sets];
    newSets[index] = { ...newSets[index], [field]: value };
    
    setCurrentExercise(prev => ({
      ...prev,
      sets: newSets
    }));
  };

  const addExerciseToTemplate = () => {
    if (!currentExercise.name.trim()) {
      alert('Please enter an exercise name');
      return;
    }

    if (currentExercise.type === 'strength') {
      if (currentExercise.numSets < 1) {
        alert('Please enter number of sets');
        return;
      }
      // Weight and reps are optional for templates - they'll be filled in when using the template
    } else {
      if (!currentExercise.duration && !currentExercise.distance) {
        alert('Please enter duration or distance for cardio');
        return;
      }
    }

    const exercise = {
      id: Date.now() + Math.random(),
      name: currentExercise.name.trim(),
      type: currentExercise.type,
      sets: currentExercise.type === 'strength' ? currentExercise.sets : [],
      duration: currentExercise.type === 'cardio' ? parseFloat(currentExercise.duration) || 0 : 0,
      distance: currentExercise.type === 'cardio' ? parseFloat(currentExercise.distance) || 0 : 0,
      notes: currentExercise.notes.trim()
    };

    setCurrentTemplate(prev => ({
      ...prev,
      exercises: [...prev.exercises, exercise]
    }));

    clearExerciseForm();
  };

  const removeExerciseFromTemplate = (exerciseId) => {
    setCurrentTemplate(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }));
  };

  const clearExerciseForm = () => {
    setCurrentExercise({
      name: '',
      type: 'strength',
      numSets: 3,
      sets: [{ weight: '', reps: '' }],
      duration: '',
      distance: '',
      notes: ''
    });
  };

  const clearTemplateForm = () => {
    setCurrentTemplate({
      name: '',
      description: '',
      day: '',
      exercises: []
    });
    clearExerciseForm();
    setIsEditing(false);
    setEditingId(null);
  };

  const saveTemplate = () => {
    if (!currentTemplate.name.trim()) {
      alert('Please enter a template name');
      return;
    }
    if (currentTemplate.exercises.length === 0) {
      alert('Please add at least one exercise to the template');
      return;
    }

    if (isEditing) {
      setTemplates(prev => prev.map(template => 
        template.id === editingId ? { ...currentTemplate, id: editingId } : template
      ));
      setIsEditing(false);
      setEditingId(null);
    } else {
      const newTemplate = {
        ...currentTemplate,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      setTemplates(prev => [...prev, newTemplate]);
    }

    clearTemplateForm();
  };

  const editTemplate = (template) => {
    setCurrentTemplate({
      name: template.name,
      description: template.description,
      day: template.day,
      exercises: template.exercises
    });
    setIsEditing(true);
    setEditingId(template.id);
  };

  const duplicateTemplate = (template) => {
    const duplicatedTemplate = {
      ...template,
      id: Date.now(),
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString()
    };
    setTemplates(prev => [...prev, duplicatedTemplate]);
  };

  const deleteTemplate = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(template => template.id !== templateId));
    }
  };

  const useTemplate = (template) => {
    localStorage.setItem('selected_template', JSON.stringify(template));
    window.location.href = '/';
  };

  const exportTemplate = (template) => {
    const dataStr = JSON.stringify(template, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    
    const filename = `${template.name.replace(/\s+/g, '_')}_template.json`;
    
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importTemplate = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const template = JSON.parse(e.target.result);
        
        // Validate template structure
        if (!template.name || !template.exercises || !Array.isArray(template.exercises)) {
          alert('Invalid template file format');
          return;
        }

        // Check for duplicate names
        const existingNames = templates.map(t => t.name);
        let templateName = template.name;
        let counter = 1;
        while (existingNames.includes(templateName)) {
          templateName = `${template.name} (${counter})`;
          counter++;
        }

        const importedTemplate = {
          ...template,
          id: Date.now(),
          name: templateName,
          createdAt: new Date().toISOString()
        };

        setTemplates(prev => [...prev, importedTemplate]);
        alert(`Template "${templateName}" imported successfully!`);
      } catch (error) {
        alert('Error reading template file. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  const exportAllTemplates = () => {
    if (templates.length === 0) {
      alert('No templates to export!');
      return;
    }

    const dataStr = JSON.stringify(templates, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `all_templates_${timestamp}.json`;
    
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" component="h2" gutterBottom>
            Create Workout Template
          </Typography>
          
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Template Name"
                  name="name"
                  value={currentTemplate.name}
                  onChange={handleTemplateInputChange}
                  placeholder="e.g., Push Day, Leg Day, Cardio"
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Day of Week"
                  name="day"
                  value={currentTemplate.day}
                  onChange={handleTemplateInputChange}
                  variant="outlined"
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Select Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </TextField>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  name="description"
                  value={currentTemplate.description}
                  onChange={handleTemplateInputChange}
                  placeholder="Describe the focus of this workout template..."
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={saveTemplate}
                startIcon={<SaveIcon />}
              >
                {isEditing ? 'Update Template' : 'Save Template'}
              </Button>
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={clearTemplateForm}
                startIcon={<ClearIcon />}
              >
                Clear Form
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Add Exercise to Template
          </Typography>
        
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Exercise Name"
                  name="name"
                  value={currentExercise.name}
                  onChange={handleExerciseInputChange}
                  placeholder="e.g., Bench Press, Running"
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Exercise Type"
                  name="type"
                  value={currentExercise.type}
                  onChange={handleExerciseInputChange}
                  required
                  variant="outlined"
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                </TextField>
              </Grid>

              {currentExercise.type === 'strength' && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Number of Sets"
                    name="numSets"
                    value={currentExercise.numSets}
                    onChange={handleNumSetsChange}
                    inputProps={{ min: 1, max: 10 }}
                    required
                    variant="outlined"
                  />
                </Grid>
              )}

              {currentExercise.type === 'cardio' && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Duration (minutes)"
                      name="duration"
                      value={currentExercise.duration}
                      onChange={handleExerciseInputChange}
                      inputProps={{ min: 1 }}
                      placeholder="30"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Distance (miles)"
                      name="distance"
                      value={currentExercise.distance}
                      onChange={handleExerciseInputChange}
                      inputProps={{ min: 0, step: 0.1 }}
                      placeholder="3.1"
                      variant="outlined"
                    />
                  </Grid>
                </>
              )}
            </Grid>

              {currentExercise.type === 'strength' && currentExercise.numSets > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Set Details
                  </Typography>
                  <Grid container spacing={2}>
                    {currentExercise.sets.map((set, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Set {index + 1}
                          </Typography>
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                size="small"
                                type="number"
                                label="Weight (lbs) - Optional"
                                value={set.weight}
                                onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                                variant="outlined"
                                placeholder="Enter during workout"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                size="small"
                                type="number"
                                label="Reps - Optional"
                                value={set.reps}
                                onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                                variant="outlined"
                                placeholder="Enter during workout"
                              />
                            </Grid>
                          </Grid>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              )}

            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notes"
                  name="notes"
                  value={currentExercise.notes}
                  onChange={handleExerciseInputChange}
                  placeholder="Form cues, modifications, etc."
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={addExerciseToTemplate}
                startIcon={<AddIcon />}
              >
                Add Exercise to Template
              </Button>
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={clearExerciseForm}
                startIcon={<ClearIcon />}
              >
                Clear Exercise Form
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {currentTemplate.exercises.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Current Template: {currentTemplate.name}
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2">
                  <strong>Day:</strong> {currentTemplate.day || 'Not specified'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2">
                  <strong>Description:</strong> {currentTemplate.description || 'No description'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2">
                  <strong>Exercises:</strong> {currentTemplate.exercises.length}
                </Typography>
              </Grid>
            </Grid>
            
            <Grid container spacing={2}>
              {currentTemplate.exercises.map((exercise, index) => (
                <Grid item xs={12} key={exercise.id}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {exercise.type === 'strength' ? <FitnessCenterIcon color="primary" /> : <DirectionsRunIcon color="secondary" />}
                        {exercise.name}
                      </Typography>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => removeExerciseFromTemplate(exercise.id)}
                        startIcon={<DeleteIcon />}
                      >
                        Remove
                      </Button>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                      <Chip label={exercise.type} size="small" color="primary" />
                      {exercise.type === 'strength' && exercise.sets.length > 0 && (
                        <Chip label={`${exercise.sets.length} sets`} size="small" variant="outlined" />
                      )}
                      {exercise.type === 'cardio' && exercise.duration > 0 && (
                        <Chip label={`${exercise.duration} min`} size="small" variant="outlined" />
                      )}
                      {exercise.type === 'cardio' && exercise.distance > 0 && (
                        <Chip label={`${exercise.distance} miles`} size="small" variant="outlined" />
                      )}
                    </Box>
                    
                    {exercise.notes && (
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FitnessCenterIcon fontSize="small" />
                        {exercise.notes}
                      </Typography>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {templates.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Your Workout Templates
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EditIcon color="primary" />
                <Typography variant="body1">
                  {templates.length} template{templates.length !== 1 ? 's' : ''}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="success" 
                  onClick={exportAllTemplates}
                  startIcon={<DownloadIcon />}
                >
                  Export All
                </Button>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  component="label"
                  startIcon={<UploadIcon />}
                >
                  Import Template
                  <input
                    type="file"
                    accept=".json"
                    onChange={importTemplate}
                    style={{ display: 'none' }}
                  />
                </Button>
              </Box>
            </Box>

            <Grid container spacing={3}>
              {templates.map(template => (
                <Grid item xs={12} sm={6} md={4} key={template.id}>
                  <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" component="h3">
                          {template.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => editTemplate(template)}
                            title="Edit Template"
                          >
                            <EditIcon fontSize="small" />
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => duplicateTemplate(template)}
                            title="Duplicate Template"
                          >
                            <EditIcon fontSize="small" />
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => exportTemplate(template)}
                            title="Export Template"
                          >
                            <DownloadIcon fontSize="small" />
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => deleteTemplate(template.id)}
                            title="Delete Template"
                          >
                            <DeleteIcon fontSize="small" />
                          </Button>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {template.description || 'No description'}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Chip label={template.day || 'No day specified'} size="small" sx={{ mr: 1, mb: 1 }} />
                        <Chip 
                          label={`${template.exercises.length} exercise${template.exercises.length !== 1 ? 's' : ''}`} 
                          size="small" 
                          variant="outlined" 
                          sx={{ mr: 1, mb: 1 }} 
                        />
                        <Chip 
                          label={`Created: ${new Date(template.createdAt).toLocaleDateString()}`} 
                          size="small" 
                          variant="outlined" 
                          sx={{ mb: 1 }} 
                        />
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        {template.exercises.slice(0, 3).map((exercise, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            {exercise.type === 'strength' ? <FitnessCenterIcon fontSize="small" color="primary" /> : <DirectionsRunIcon fontSize="small" color="secondary" />}
                            <Typography variant="body2">{exercise.name}</Typography>
                          </Box>
                        ))}
                        {template.exercises.length > 3 && (
                          <Typography variant="body2" color="text.secondary">
                            +{template.exercises.length - 3} more
                          </Typography>
                        )}
                      </Box>
                      
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => useTemplate(template)}
                        startIcon={<AddIcon />}
                      >
                        Use This Template
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
            ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {templates.length === 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <EditIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No Templates Yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create your first workout template above to get started!
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default WorkoutTemplates;

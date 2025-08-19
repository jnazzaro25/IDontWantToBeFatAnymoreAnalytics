import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faTrash, 
  faEdit, 
  faCopy, 
  faPlay,
  faDownload,
  faUpload,
  faTimes,
  faDumbbell,
  faRunning,
  faSave,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';

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
      if (currentExercise.sets.some(set => !set.weight && !set.reps)) {
        alert('Please fill in all set details');
        return;
      }
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
    <div className="container">
      <div className="card">
        <h2>Create Workout Template</h2>
        
        <div className="template-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="template-name">Template Name *</label>
              <input
                type="text"
                id="template-name"
                name="name"
                value={currentTemplate.name}
                onChange={handleTemplateInputChange}
                placeholder="e.g., Push Day, Leg Day, Cardio"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="template-day">Day of Week</label>
              <select
                id="template-day"
                name="day"
                value={currentTemplate.day}
                onChange={handleTemplateInputChange}
              >
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="template-description">Description</label>
            <textarea
              id="template-description"
              name="description"
              value={currentTemplate.description}
              onChange={handleTemplateInputChange}
              placeholder="Describe the focus of this workout template..."
            />
          </div>
        </div>

        <div className="template-actions">
          <button type="button" onClick={saveTemplate} className="btn btn-primary">
            <FontAwesomeIcon icon={faSave} /> {isEditing ? 'Update Template' : 'Save Template'}
          </button>
          <button type="button" onClick={clearTemplateForm} className="btn btn-secondary">
            <FontAwesomeIcon icon={faTimes} /> Clear Form
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Add Exercise to Template</h2>
        
        <div className="exercise-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="exercise-name">Exercise Name *</label>
              <input
                type="text"
                id="exercise-name"
                name="name"
                value={currentExercise.name}
                onChange={handleExerciseInputChange}
                placeholder="e.g., Bench Press, Running"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="exercise-type">Exercise Type *</label>
              <select
                id="exercise-type"
                name="type"
                value={currentExercise.type}
                onChange={handleExerciseInputChange}
                required
              >
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
              </select>
            </div>

            {currentExercise.type === 'strength' && (
              <div className="form-group">
                <label htmlFor="num-sets">Number of Sets *</label>
                <input
                  type="number"
                  id="num-sets"
                  name="numSets"
                  value={currentExercise.numSets}
                  onChange={handleNumSetsChange}
                  min="1"
                  max="10"
                  required
                />
              </div>
            )}

            {currentExercise.type === 'cardio' && (
              <>
                <div className="form-group">
                  <label htmlFor="duration">Duration (minutes)</label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={currentExercise.duration}
                    onChange={handleExerciseInputChange}
                    placeholder="30"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="distance">Distance (miles)</label>
                  <input
                    type="number"
                    id="distance"
                    name="distance"
                    value={currentExercise.distance}
                    onChange={handleExerciseInputChange}
                    step="0.1"
                    placeholder="3.1"
                  />
                </div>
              </>
            )}
          </div>

          {currentExercise.type === 'strength' && currentExercise.numSets > 0 && (
            <div className="sets-container">
              <h3>Set Details</h3>
              <div className="sets-grid">
                {currentExercise.sets.map((set, index) => (
                  <div key={index} className="set-item">
                    <div className="set-number">Set {index + 1}</div>
                    <div className="set-inputs">
                      <input
                        type="number"
                        placeholder="Weight (lbs)"
                        value={set.weight}
                        onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Reps"
                        value={set.reps}
                        onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="exercise-notes">Notes</label>
            <textarea
              id="exercise-notes"
              name="notes"
              value={currentExercise.notes}
              onChange={handleExerciseInputChange}
              placeholder="Form cues, modifications, etc."
            />
          </div>

          <div className="exercise-actions">
            <button type="button" onClick={addExerciseToTemplate} className="btn btn-primary">
              <FontAwesomeIcon icon={faPlus} /> Add Exercise to Template
            </button>
            <button type="button" onClick={clearExerciseForm} className="btn btn-secondary">
              <FontAwesomeIcon icon={faTimes} /> Clear Exercise Form
            </button>
          </div>
        </div>
      </div>

      {currentTemplate.exercises.length > 0 && (
        <div className="card">
          <h2>Current Template: {currentTemplate.name}</h2>
          <div className="template-preview">
            <div className="template-meta">
              <p><strong>Day:</strong> {currentTemplate.day || 'Not specified'}</p>
              <p><strong>Description:</strong> {currentTemplate.description || 'No description'}</p>
              <p><strong>Exercises:</strong> {currentTemplate.exercises.length}</p>
            </div>
            
            <div className="template-exercises">
              {currentTemplate.exercises.map((exercise, index) => (
                <div key={exercise.id} className="template-exercise">
                  <div className="exercise-header">
                    <h4>
                      <FontAwesomeIcon 
                        icon={exercise.type === 'strength' ? faDumbbell : faRunning} 
                        className="exercise-icon"
                      />
                      {exercise.name}
                    </h4>
                    <button
                      onClick={() => removeExerciseFromTemplate(exercise.id)}
                      className="remove-exercise"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  
                  <div className="exercise-details">
                    <span className="exercise-type">{exercise.type}</span>
                    {exercise.type === 'strength' && exercise.sets.length > 0 && (
                      <span className="sets-info">{exercise.sets.length} sets</span>
                    )}
                    {exercise.type === 'cardio' && exercise.duration > 0 && (
                      <span className="duration-info">{exercise.duration} min</span>
                    )}
                    {exercise.type === 'cardio' && exercise.distance > 0 && (
                      <span className="distance-info">{exercise.distance} miles</span>
                    )}
                  </div>
                  
                  {exercise.notes && (
                    <div className="exercise-notes">
                      <FontAwesomeIcon icon={faDumbbell} />
                      {exercise.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {templates.length > 0 && (
        <div className="card">
          <h2>Your Workout Templates</h2>
          
          <div className="templates-header">
            <div className="templates-count">
              <FontAwesomeIcon icon={faLayerGroup} />
              <span>{templates.length} template{templates.length !== 1 ? 's' : ''}</span>
            </div>
            
            <div className="templates-actions">
              <button onClick={exportAllTemplates} className="btn btn-success">
                <FontAwesomeIcon icon={faDownload} /> Export All
              </button>
              
              <label className="btn btn-primary">
                <FontAwesomeIcon icon={faUpload} /> Import Template
                <input
                  type="file"
                  accept=".json"
                  onChange={importTemplate}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          <div className="templates-grid">
            {templates.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-header">
                  <h3>{template.name}</h3>
                  <div className="template-actions">
                    <button
                      onClick={() => editTemplate(template)}
                      className="btn btn-secondary btn-sm"
                      title="Edit Template"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => duplicateTemplate(template)}
                      className="btn btn-secondary btn-sm"
                      title="Duplicate Template"
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </button>
                    <button
                      onClick={() => exportTemplate(template)}
                      className="btn btn-secondary btn-sm"
                      title="Export Template"
                    >
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      className="btn btn-danger btn-sm"
                      title="Delete Template"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
                
                <div className="template-info">
                  <p className="template-description">
                    {template.description || 'No description'}
                  </p>
                  <div className="template-meta">
                    <span className="template-day">{template.day || 'No day specified'}</span>
                    <span className="template-exercises-count">
                      {template.exercises.length} exercise{template.exercises.length !== 1 ? 's' : ''}
                    </span>
                    <span className="template-created">
                      Created: {new Date(template.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="template-exercises-preview">
                  {template.exercises.slice(0, 3).map((exercise, index) => (
                    <div key={index} className="template-exercise-preview">
                      <FontAwesomeIcon 
                        icon={exercise.type === 'strength' ? faDumbbell : faRunning} 
                        className="exercise-icon"
                      />
                      <span className="exercise-name">{exercise.name}</span>
                    </div>
                  ))}
                  {template.exercises.length > 3 && (
                    <div className="more-exercises">
                      +{template.exercises.length - 3} more
                    </div>
                  )}
                </div>
                
                <div className="template-use">
                  <button
                    onClick={() => useTemplate(template)}
                    className="btn btn-primary"
                  >
                    <FontAwesomeIcon icon={faPlay} /> Use This Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {templates.length === 0 && (
        <div className="card">
          <div className="no-templates">
            <FontAwesomeIcon icon={faLayerGroup} />
            <h3>No Templates Yet</h3>
            <p>Create your first workout template above to get started!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutTemplates;

// Workout Templates Management
class WorkoutTemplates {
    constructor() {
        this.templates = [];
        this.currentTemplate = {
            name: '',
            day: '',
            description: '',
            exercises: []
        };
        this.init();
    }

    init() {
        this.loadTemplatesFromStorage();
        this.setupEventListeners();
        this.updateTemplatesDisplay();
    }

    setupEventListeners() {
        // Template exercise type change
        document.getElementById('template-exercise-type').addEventListener('change', (e) => {
            this.toggleTemplateFormFields(e.target.value);
        });

        // Number of sets change for template
        document.getElementById('template-num-sets').addEventListener('input', (e) => {
            this.generateTemplateSetInputs(parseInt(e.target.value) || 0);
        });

        // Add exercise to template
        document.getElementById('add-exercise-to-template').addEventListener('click', () => {
            this.addExerciseToTemplate();
        });

        // Save template
        document.getElementById('save-template').addEventListener('click', () => {
            this.saveTemplate();
        });

        // Clear template form
        document.getElementById('clear-template-form').addEventListener('click', () => {
            this.clearTemplateForm();
        });

        // Export templates
        document.getElementById('export-templates').addEventListener('click', () => {
            this.exportTemplates();
        });

        // Import templates
        document.getElementById('import-templates').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });

        // Handle file import
        document.getElementById('import-file').addEventListener('change', (e) => {
            this.importTemplates(e);
        });

        // Enter key support for form inputs
        const formInputs = document.querySelectorAll('.template-form input, .template-form select, .template-form textarea');
        formInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addExerciseToTemplate();
                }
            });
        });
    }

    toggleTemplateFormFields(exerciseType) {
        const strengthFields = document.querySelectorAll('.template-strength-field');
        const cardioFields = document.querySelectorAll('.template-cardio-field');
        const setsContainer = document.getElementById('template-sets-container');

        // Hide all fields first
        strengthFields.forEach(field => field.style.display = 'none');
        cardioFields.forEach(field => field.style.display = 'none');
        setsContainer.style.display = 'none';

        // Show relevant fields based on type
        if (exerciseType === 'strength') {
            strengthFields.forEach(field => field.style.display = 'block');
        } else if (exerciseType === 'cardio') {
            cardioFields.forEach(field => field.style.display = 'block');
        }

        // Clear values when switching types
        if (exerciseType !== 'strength') {
            document.getElementById('template-num-sets').value = '';
            setsContainer.innerHTML = '';
        }
        if (exerciseType !== 'cardio') {
            document.getElementById('template-duration').value = '';
            document.getElementById('template-distance').value = '';
        }
    }

    generateTemplateSetInputs(numSets) {
        const container = document.getElementById('template-sets-container');
        
        if (numSets <= 0) {
            container.style.display = 'none';
            container.innerHTML = '';
            return;
        }

        container.style.display = 'block';
        
        let setsHTML = '<div class="template-sets-header"><h5>Template Set Details</h5></div>';
        setsHTML += '<div class="template-sets-grid">';
        
        for (let i = 1; i <= numSets; i++) {
            setsHTML += `
                <div class="template-set-item">
                    <div class="template-set-number">Set ${i}</div>
                    <div class="template-set-inputs">
                        <div class="input-group">
                            <label for="template-weight-${i}">Target Weight (lbs)</label>
                            <input type="number" id="template-weight-${i}" min="0" step="0.5" placeholder="135" class="template-set-weight">
                        </div>
                        <div class="input-group">
                            <label for="template-reps-${i}">Target Reps</label>
                            <input type="number" id="template-reps-${i}" min="1" placeholder="10" class="template-set-reps">
                        </div>
                    </div>
                </div>
            `;
        }
        
        setsHTML += '</div>';
        container.innerHTML = setsHTML;
    }

    addExerciseToTemplate() {
        const exerciseName = document.getElementById('template-exercise-name').value.trim();
        const exerciseType = document.getElementById('template-exercise-type').value;
        
        if (!exerciseName) {
            this.showMessage('Please enter an exercise name', 'error');
            return;
        }

        if (!exerciseType) {
            this.showMessage('Please select an exercise type', 'error');
            return;
        }

        // Collect set data for strength exercises
        let sets = [];
        if (exerciseType === 'strength') {
            const numSets = parseInt(document.getElementById('template-num-sets').value) || 0;
            if (numSets > 0) {
                for (let i = 1; i <= numSets; i++) {
                    const weight = parseFloat(document.getElementById(`template-weight-${i}`).value) || 0;
                    const reps = parseInt(document.getElementById(`template-reps-${i}`).value) || 0;
                    sets.push({ weight, reps });
                }
            }
        }

        const exercise = {
            id: Date.now() + Math.random(), // Ensure unique ID
            name: exerciseName,
            type: exerciseType,
            sets: sets,
            duration: exerciseType === 'cardio' ? parseInt(document.getElementById('template-duration').value) || 0 : 0,
            distance: exerciseType === 'cardio' ? parseFloat(document.getElementById('template-distance').value) || 0 : 0,
            notes: document.getElementById('template-exercise-notes').value.trim()
        };

        this.currentTemplate.exercises.push(exercise);
        this.updateTemplateExercisesDisplay();
        this.clearTemplateExerciseForm();
        this.showMessage('Exercise added to template!', 'success');
    }

    clearTemplateExerciseForm() {
        document.getElementById('template-exercise-name').value = '';
        document.getElementById('template-exercise-type').value = '';
        document.getElementById('template-num-sets').value = '';
        document.getElementById('template-duration').value = '';
        document.getElementById('template-distance').value = '';
        document.getElementById('template-exercise-notes').value = '';
        
        // Hide all type-specific fields
        this.toggleTemplateFormFields('');
        
        document.getElementById('template-exercise-name').focus();
    }

    updateTemplateExercisesDisplay() {
        const container = document.getElementById('template-exercises-list');
        
        if (this.currentTemplate.exercises.length === 0) {
            container.innerHTML = `
                <div class="no-exercises">
                    <i class="fas fa-plus-circle"></i>
                    <p>No exercises added yet. Add your first exercise below!</p>
                </div>
            `;
        } else {
            container.innerHTML = this.currentTemplate.exercises.map(exercise => this.createTemplateExerciseHTML(exercise)).join('');
        }

        this.setupTemplateExerciseDeleteListeners();
    }

    createTemplateExerciseHTML(exercise) {
        if (exercise.type === 'strength' && exercise.sets && exercise.sets.length > 0) {
            // Display each set individually for strength exercises
            const setsHTML = exercise.sets.map((set, index) => {
                const setNumber = index + 1;
                const weightText = set.weight > 0 ? `${set.weight} lbs` : 'Target weight';
                const repsText = set.reps > 0 ? `${set.reps} reps` : 'Target reps';
                return `
                    <div class="template-set-display">
                        <span class="template-set-number">Set ${setNumber}:</span>
                        <span class="template-set-details">${repsText} @ ${weightText}</span>
                    </div>
                `;
            }).join('');

            return `
                <div class="template-exercise-item" data-id="${exercise.id}">
                    <div class="template-exercise-header">
                        <span class="template-exercise-name">${exercise.name}</span>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span class="template-exercise-type">${exercise.type}</span>
                            <button class="delete-template-exercise" onclick="workoutTemplates.deleteExerciseFromTemplate(${exercise.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="template-sets-display">
                        ${setsHTML}
                    </div>
                    ${exercise.notes ? `<div class="template-exercise-notes">${exercise.notes}</div>` : ''}
                </div>
            `;
        } else if (exercise.type === 'cardio') {
            // Display cardio exercise details
            const details = [];
            if (exercise.duration > 0) details.push(`<div class="detail-item"><span class="detail-label">Target Duration</span><span class="detail-value">${exercise.duration} min</span></div>`);
            if (exercise.distance > 0) details.push(`<div class="detail-item"><span class="detail-label">Target Distance</span><span class="detail-value">${exercise.distance} mi</span></div>`);

            return `
                <div class="template-exercise-item" data-id="${exercise.id}">
                    <div class="template-exercise-header">
                        <span class="template-exercise-name">${exercise.name}</span>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span class="template-exercise-type">${exercise.type}</span>
                            <button class="delete-template-exercise" onclick="workoutTemplates.deleteExerciseFromTemplate(${exercise.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    ${details.length > 0 ? `<div class="exercise-details">${details.join('')}</div>` : ''}
                    ${exercise.notes ? `<div class="template-exercise-notes">${exercise.notes}</div>` : ''}
                </div>
            `;
        } else {
            // Display other exercise types
            return `
                <div class="template-exercise-item" data-id="${exercise.id}">
                    <div class="template-exercise-header">
                        <span class="template-exercise-name">${exercise.name}</span>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span class="template-exercise-type">${exercise.type}</span>
                            <button class="delete-template-exercise" onclick="workoutTemplates.deleteExerciseFromTemplate(${exercise.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    ${exercise.notes ? `<div class="template-exercise-notes">${exercise.notes}</div>` : ''}
                </div>
            `;
        }
    }

    deleteExerciseFromTemplate(id) {
        this.currentTemplate.exercises = this.currentTemplate.exercises.filter(exercise => exercise.id !== id);
        this.updateTemplateExercisesDisplay();
        this.showMessage('Exercise removed from template!', 'success');
    }

    setupTemplateExerciseDeleteListeners() {
        // Delete listeners are set up inline in the HTML for simplicity
    }

    saveTemplate() {
        const name = document.getElementById('template-name').value.trim();
        const day = document.getElementById('template-day').value;
        const description = document.getElementById('template-description').value.trim();
        
        if (!name) {
            this.showMessage('Please enter a template name', 'error');
            return;
        }

        if (this.currentTemplate.exercises.length === 0) {
            this.showMessage('Please add at least one exercise to the template', 'error');
            return;
        }

        // Check if template name already exists
        const existingTemplate = this.templates.find(t => t.name.toLowerCase() === name.toLowerCase());
        if (existingTemplate) {
            if (confirm(`Template "${name}" already exists. Do you want to replace it?`)) {
                // Remove existing template
                this.templates = this.templates.filter(t => t.name.toLowerCase() !== name.toLowerCase());
            } else {
                return;
            }
        }

        const template = {
            id: Date.now(),
            name: name,
            day: day,
            description: description,
            exercises: [...this.currentTemplate.exercises],
            createdAt: new Date().toISOString()
        };

        this.templates.push(template);
        this.saveTemplatesToStorage();
        this.updateTemplatesDisplay();
        this.clearTemplateForm();
        this.showMessage(`Template "${name}" saved successfully!`, 'success');
    }

    clearTemplateForm() {
        document.getElementById('template-name').value = '';
        document.getElementById('template-day').value = '';
        document.getElementById('template-description').value = '';
        this.currentTemplate = {
            name: '',
            day: '',
            description: '',
            exercises: []
        };
        this.updateTemplateExercisesDisplay();
        this.clearTemplateExerciseForm();
    }

    updateTemplatesDisplay() {
        const container = document.getElementById('templates-container');
        
        if (this.templates.length === 0) {
            container.innerHTML = `
                <div class="no-templates">
                    <i class="fas fa-layer-group"></i>
                    <p>No templates created yet. Create your first template above!</p>
                </div>
            `;
        } else {
            container.innerHTML = this.templates.map(template => this.createTemplateHTML(template)).join('');
        }

        this.setupTemplateActionListeners();
    }

    createTemplateHTML(template) {
        const dayText = template.day ? `• ${template.day.charAt(0).toUpperCase() + template.day.slice(1)}` : '';
        const exerciseCount = template.exercises.length;
        
        return `
            <div class="template-item" data-id="${template.id}">
                <div class="template-header">
                    <div class="template-info">
                        <h3>${template.name}</h3>
                        <p class="template-meta">${exerciseCount} exercise${exerciseCount > 1 ? 's' : ''} ${dayText}</p>
                        ${template.description ? `<p class="template-description">${template.description}</p>` : ''}
                    </div>
                    <div class="template-actions">
                        <button class="btn btn-primary btn-sm" onclick="workoutTemplates.loadTemplate(${template.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-success btn-sm" onclick="workoutTemplates.useTemplate(${template.id})">
                            <i class="fas fa-play"></i> Use
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="workoutTemplates.duplicateTemplate(${template.id})">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="workoutTemplates.deleteTemplate(${template.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="template-exercises-preview">
                    ${template.exercises.slice(0, 3).map(ex => `<span class="exercise-preview">${ex.name}</span>`).join('')}
                    ${template.exercises.length > 3 ? `<span class="exercise-preview more">+${template.exercises.length - 3} more</span>` : ''}
                </div>
            </div>
        `;
    }

    setupTemplateActionListeners() {
        // Action listeners are set up inline in the HTML for simplicity
    }

    loadTemplate(id) {
        const template = this.templates.find(t => t.id === id);
        if (!template) return;

        // Load template into the form
        document.getElementById('template-name').value = template.name;
        document.getElementById('template-day').value = template.day;
        document.getElementById('template-description').value = template.description;
        
        this.currentTemplate = {
            name: template.name,
            day: template.day,
            description: template.description,
            exercises: [...template.exercises]
        };

        this.updateTemplateExercisesDisplay();
        this.showMessage(`Template "${template.name}" loaded for editing!`, 'success');
    }

    useTemplate(id) {
        const template = this.templates.find(t => t.id === id);
        if (!template) return;

        // Store template data for use in main workout page
        localStorage.setItem('selected_template', JSON.stringify(template));
        
        // Redirect to main workout page
        window.location.href = 'index.html';
    }

    duplicateTemplate(id) {
        const template = this.templates.find(t => t.id === id);
        if (!template) return;

        const newTemplate = {
            ...template,
            id: Date.now(),
            name: `${template.name} (Copy)`,
            createdAt: new Date().toISOString()
        };

        this.templates.push(newTemplate);
        this.saveTemplatesToStorage();
        this.updateTemplatesDisplay();
        this.showMessage(`Template "${template.name}" duplicated successfully!`, 'success');
    }

    deleteTemplate(id) {
        const template = this.templates.find(t => t.id === id);
        if (!template) return;

        if (confirm(`Are you sure you want to delete template "${template.name}"?`)) {
            this.templates = this.templates.filter(t => t.id !== id);
            this.saveTemplatesToStorage();
            this.updateTemplatesDisplay();
            this.showMessage(`Template "${template.name}" deleted successfully!`, 'success');
        }
    }

    exportTemplates() {
        if (this.templates.length === 0) {
            this.showMessage('No templates to export!', 'error');
            return;
        }

        const dataStr = JSON.stringify(this.templates, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const link = document.createElement('a');
        
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `workout_templates_${timestamp}.json`;
        
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showMessage(`Exported ${this.templates.length} templates to ${filename}!`, 'success');
    }

    importTemplates(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTemplates = JSON.parse(e.target.result);
                
                if (Array.isArray(importedTemplates)) {
                    // Merge imported templates with existing ones
                    importedTemplates.forEach(template => {
                        template.id = Date.now() + Math.random(); // Ensure unique ID
                        template.createdAt = new Date().toISOString();
                    });
                    
                    this.templates = [...this.templates, ...importedTemplates];
                    this.saveTemplatesToStorage();
                    this.updateTemplatesDisplay();
                    
                    this.showMessage(`Successfully imported ${importedTemplates.length} templates!`, 'success');
                } else {
                    this.showMessage('Invalid template file format!', 'error');
                }
            } catch (error) {
                this.showMessage('Error reading template file!', 'error');
            }
        };
        
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    saveTemplatesToStorage() {
        localStorage.setItem('workout_templates', JSON.stringify(this.templates));
    }

    loadTemplatesFromStorage() {
        const stored = localStorage.getItem('workout_templates');
        this.templates = stored ? JSON.parse(stored) : [];
    }

    showMessage(message, type = 'success') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;

        // Insert after header
        const header = document.querySelector('.header');
        header.parentNode.insertBefore(messageDiv, header.nextSibling);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.workoutTemplates = new WorkoutTemplates();
}); 
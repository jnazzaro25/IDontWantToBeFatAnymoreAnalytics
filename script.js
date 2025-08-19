// Workout Tracker Application
class WorkoutTracker {
    constructor() {
        this.exercises = [];
        this.currentDate = new Date().toISOString().split('T')[0];
        this.selectedTemplate = null;
        this.init();
    }

    init() {
        this.checkForSelectedTemplate();
        this.setupEventListeners();
        this.loadExercisesFromStorage();
        this.updateDisplay();
    }

    checkForSelectedTemplate() {
        const storedTemplate = localStorage.getItem('selected_template');
        if (storedTemplate) {
            try {
                this.selectedTemplate = JSON.parse(storedTemplate);
                this.showTemplateSelection();
                // Clear the stored template so it doesn't persist across sessions
                localStorage.removeItem('selected_template');
            } catch (error) {
                console.error('Error parsing stored template:', error);
                localStorage.removeItem('selected_template');
            }
        }
    }

    showTemplateSelection() {
        if (!this.selectedTemplate) return;

        const templateSelection = document.getElementById('template-selection');
        const templateName = document.getElementById('selected-template-name');
        const templateDescription = document.getElementById('selected-template-description');
        const templateMeta = document.getElementById('selected-template-meta');
        const templateExercisesPreview = document.getElementById('template-exercises-preview');

        // Populate template info
        templateName.textContent = this.selectedTemplate.name;
        templateDescription.textContent = this.selectedTemplate.description || 'No description provided';
        
        const dayText = this.selectedTemplate.day ? `• ${this.selectedTemplate.day.charAt(0).toUpperCase() + this.selectedTemplate.day.slice(1)}` : '';
        const exerciseCount = this.selectedTemplate.exercises.length;
        templateMeta.textContent = `${exerciseCount} exercise${exerciseCount > 1 ? 's' : ''} ${dayText}`;

        // Show template exercises preview
        templateExercisesPreview.innerHTML = this.selectedTemplate.exercises.map(exercise => {
            if (exercise.type === 'strength' && exercise.sets && exercise.sets.length > 0) {
                const setsText = exercise.sets.map((set, index) => {
                    const weightText = set.weight > 0 ? `${set.weight} lbs` : 'Target weight';
                    const repsText = set.reps > 0 ? `${set.reps} reps` : 'Target reps';
                    return `Set ${index + 1}: ${repsText} @ ${weightText}`;
                }).join(', ');
                return `<div class="template-exercise-preview"><strong>${exercise.name}</strong> (${exercise.type}) - ${setsText}</div>`;
            } else if (exercise.type === 'cardio') {
                const details = [];
                if (exercise.duration > 0) details.push(`${exercise.duration} min`);
                if (exercise.distance > 0) details.push(`${exercise.distance} mi`);
                return `<div class="template-exercise-preview"><strong>${exercise.name}</strong> (${exercise.type}) - ${details.join(', ')}</div>`;
            } else {
                return `<div class="template-exercise-preview"><strong>${exercise.name}</strong> (${exercise.type})</div>`;
            }
        }).join('');

        templateSelection.style.display = 'block';
    }

    setupEventListeners() {
        // Add exercise button
        document.getElementById('add-exercise').addEventListener('click', () => {
            this.addExercise();
        });

        // Save workout button
        document.getElementById('save-workout').addEventListener('click', () => {
            this.saveWorkoutToCSV();
        });

        // Clear workout button
        document.getElementById('clear-workout').addEventListener('click', () => {
            this.clearWorkout();
        });

        // Load template button
        document.getElementById('load-template').addEventListener('click', () => {
            this.loadTemplateIntoWorkout();
        });

        // Clear template button
        document.getElementById('clear-template').addEventListener('click', () => {
            this.clearSelectedTemplate();
        });

        // Date change
        document.getElementById('workout-date').addEventListener('change', (e) => {
            this.currentDate = e.target.value;
            this.loadExercisesFromStorage();
            this.updateDisplay();
        });

        // Exercise type change - show/hide relevant fields
        document.getElementById('exercise-type').addEventListener('change', (e) => {
            this.toggleFormFields(e.target.value);
        });

        // Number of sets change - generate set inputs
        document.getElementById('num-sets').addEventListener('input', (e) => {
            this.generateSetInputs(parseInt(e.target.value) || 0);
        });

        // Enter key support for form inputs
        const formInputs = document.querySelectorAll('.exercise-form input, .exercise-form select, .exercise-form textarea');
        formInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addExercise();
                }
            });
        });
    }

    loadTemplateIntoWorkout() {
        if (!this.selectedTemplate || this.selectedTemplate.exercises.length === 0) {
            this.showMessage('No template to load!', 'error');
            return;
        }

        // Convert template exercises to workout exercises
        this.selectedTemplate.exercises.forEach(templateExercise => {
            const exercise = {
                id: Date.now() + Math.random(), // Ensure unique ID
                name: templateExercise.name,
                type: templateExercise.type,
                sets: templateExercise.sets ? templateExercise.sets.map(set => ({
                    weight: 0, // Start with 0 weight for actual workout
                    reps: 0     // Start with 0 reps for actual workout
                })) : [],
                duration: templateExercise.duration || 0,
                distance: templateExercise.distance || 0,
                notes: templateExercise.notes || '',
                timestamp: new Date().toISOString()
            };

            this.exercises.push(exercise);
        });

        this.saveExercisesToStorage();
        this.updateDisplay();
        this.clearSelectedTemplate();
        this.showMessage(`Template "${this.selectedTemplate.name}" loaded successfully! You can now fill in your actual performance data.`, 'success');
    }

    clearSelectedTemplate() {
        this.selectedTemplate = null;
        document.getElementById('template-selection').style.display = 'none';
    }

    toggleFormFields(exerciseType) {
        const strengthFields = document.querySelectorAll('.strength-field');
        const cardioFields = document.querySelectorAll('.cardio-field');
        const setsContainer = document.getElementById('sets-container');

        // Hide all fields first
        strengthFields.forEach(field => field.style.display = 'none');
        cardioFields.forEach(field => field.style.display = 'none');
        setsContainer.style.display = 'none';

        // Show relevant fields based on type
        if (exerciseType === 'strength') {
            strengthFields.forEach(field => field.style.display = 'block');
            // Make number of sets required for strength
            document.getElementById('num-sets').required = true;
            document.getElementById('duration').required = false;
            document.getElementById('distance').required = false;
        } else if (exerciseType === 'cardio') {
            cardioFields.forEach(field => field.style.display = 'block');
            // Make duration required for cardio
            document.getElementById('duration').required = true;
            document.getElementById('num-sets').required = false;
        } else if (exerciseType === 'flexibility' || exerciseType === 'other') {
            // Show all fields for flexibility and other types
            strengthFields.forEach(field => field.style.display = 'block');
            cardioFields.forEach(field => field.style.display = 'block');
            // Make no fields required for these types
            document.getElementById('num-sets').required = false;
            document.getElementById('duration').required = false;
            document.getElementById('distance').required = false;
        }

        // Clear values when switching types
        if (exerciseType !== 'strength') {
            document.getElementById('num-sets').value = '';
            setsContainer.innerHTML = '';
        }
        if (exerciseType !== 'cardio') {
            document.getElementById('duration').value = '';
            document.getElementById('distance').value = '';
        }
    }

    generateSetInputs(numSets) {
        const container = document.getElementById('sets-container');
        
        if (numSets <= 0) {
            container.style.display = 'none';
            container.innerHTML = '';
            return;
        }

        container.style.display = 'block';
        
        let setsHTML = '<div class="sets-header"><h4>Set Details</h4></div>';
        setsHTML += '<div class="sets-grid">';
        
        for (let i = 1; i <= numSets; i++) {
            setsHTML += `
                <div class="set-item">
                    <div class="set-number">Set ${i}</div>
                    <div class="set-inputs">
                        <div class="input-group">
                            <label for="weight-${i}">Weight (lbs)</label>
                            <input type="number" id="weight-${i}" min="0" step="0.5" placeholder="135" class="set-weight">
                        </div>
                        <div class="input-group">
                            <label for="reps-${i}">Reps</label>
                            <input type="number" id="reps-${i}" min="1" placeholder="10" class="set-reps" required>
                        </div>
                    </div>
                </div>
            `;
        }
        
        setsHTML += '</div>';
        container.innerHTML = setsHTML;
    }

    setCurrentDate() {
        document.getElementById('workout-date').value = this.currentDate;
    }

    addExercise() {
        const exerciseName = document.getElementById('exercise-name').value.trim();
        const exerciseType = document.getElementById('exercise-type').value;
        
        if (!exerciseName) {
            this.showMessage('Please enter an exercise name', 'error');
            return;
        }

        if (!exerciseType) {
            this.showMessage('Please select an exercise type', 'error');
            return;
        }

        // Validate required fields based on exercise type
        if (exerciseType === 'strength') {
            const numSets = document.getElementById('num-sets').value;
            if (!numSets || numSets < 1) {
                this.showMessage('Please enter the number of sets for strength exercises', 'error');
                return;
            }

            // Validate that all set inputs are filled
            const setInputs = document.querySelectorAll('.set-reps');
            for (let input of setInputs) {
                if (!input.value || input.value < 1) {
                    this.showMessage('Please fill in reps for all sets', 'error');
                    return;
                }
            }
        }

        if (exerciseType === 'cardio') {
            const duration = document.getElementById('duration').value;
            if (!duration) {
                this.showMessage('Duration is required for cardio exercises', 'error');
                return;
            }
        }

        // Collect set data for strength exercises
        let sets = [];
        if (exerciseType === 'strength') {
            const numSets = parseInt(document.getElementById('num-sets').value);
            for (let i = 1; i <= numSets; i++) {
                const weight = parseFloat(document.getElementById(`weight-${i}`).value) || 0;
                const reps = parseInt(document.getElementById(`reps-${i}`).value) || 0;
                sets.push({ weight, reps });
            }
        }

        const exercise = {
            id: Date.now(),
            name: exerciseName,
            type: exerciseType,
            sets: sets,
            duration: exerciseType === 'cardio' ? parseInt(document.getElementById('duration').value) || 0 : 0,
            distance: exerciseType === 'cardio' ? parseFloat(document.getElementById('distance').value) || 0 : 0,
            notes: document.getElementById('notes').value.trim(),
            timestamp: new Date().toISOString()
        };

        this.exercises.push(exercise);
        this.saveExercisesToStorage();
        this.updateDisplay();
        this.clearForm();
        this.showMessage('Exercise added successfully!', 'success');
    }

    clearForm() {
        document.getElementById('exercise-name').value = '';
        document.getElementById('exercise-type').value = '';
        document.getElementById('num-sets').value = '';
        document.getElementById('duration').value = '';
        document.getElementById('distance').value = '';
        document.getElementById('notes').value = '';
        
        // Hide all type-specific fields
        this.toggleFormFields('');
        
        document.getElementById('exercise-name').focus();
    }

    deleteExercise(id) {
        this.exercises = this.exercises.filter(exercise => exercise.id !== id);
        this.saveExercisesToStorage();
        this.updateDisplay();
        this.showMessage('Exercise removed successfully!', 'success');
    }

    updateDisplay() {
        const container = document.getElementById('exercises-container');
        
        if (this.exercises.length === 0) {
            container.innerHTML = `
                <div class="no-exercises">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No exercises added yet. Start by adding your first exercise above!</p>
                </div>
            `;
        } else {
            container.innerHTML = this.exercises.map(exercise => this.createExerciseHTML(exercise)).join('');
        }

        this.updateSummary();
        this.setupDeleteListeners();
    }

    createExerciseHTML(exercise) {
        if (exercise.type === 'strength' && exercise.sets && exercise.sets.length > 0) {
            // Display each set individually for strength exercises
            const setsHTML = exercise.sets.map((set, index) => {
                const setNumber = index + 1;
                const weightText = set.weight > 0 ? `${set.weight} lbs` : 'Bodyweight';
                return `
                    <div class="set-display">
                        <span class="set-number">Set ${setNumber}:</span>
                        <span class="set-details">${set.reps} reps @ ${weightText}</span>
                    </div>
                `;
            }).join('');

            return `
                <div class="exercise-item" data-id="${exercise.id}">
                    <div class="exercise-header">
                        <span class="exercise-name">${exercise.name}</span>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span class="exercise-type">${exercise.type}</span>
                            <button class="delete-exercise" onclick="workoutTracker.deleteExercise(${exercise.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="sets-display">
                        ${setsHTML}
                    </div>
                    ${exercise.notes ? `<div class="exercise-notes">${exercise.notes}</div>` : ''}
                </div>
            `;
        } else if (exercise.type === 'cardio') {
            // Display cardio exercise details
            const details = [];
            if (exercise.duration > 0) details.push(`<div class="detail-item"><span class="detail-label">Duration</span><span class="detail-value">${exercise.duration} min</span></div>`);
            if (exercise.distance > 0) details.push(`<div class="detail-item"><span class="detail-label">Distance</span><span class="detail-value">${exercise.distance} mi</span></div>`);

            return `
                <div class="exercise-item" data-id="${exercise.id}">
                    <div class="exercise-header">
                        <span class="exercise-name">${exercise.name}</span>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span class="exercise-type">${exercise.type}</span>
                            <button class="delete-exercise" onclick="workoutTracker.deleteExercise(${exercise.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    ${details.length > 0 ? `<div class="exercise-details">${details.join('')}</div>` : ''}
                    ${exercise.notes ? `<div class="exercise-notes">${exercise.notes}</div>` : ''}
                </div>
            `;
        } else {
            // Display other exercise types
            return `
                <div class="exercise-item" data-id="${exercise.id}">
                    <div class="exercise-header">
                        <span class="exercise-name">${exercise.name}</span>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span class="exercise-type">${exercise.type}</span>
                            <button class="delete-exercise" onclick="workoutTracker.deleteExercise(${exercise.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    ${exercise.notes ? `<div class="exercise-notes">${exercise.notes}</div>` : ''}
                </div>
            `;
        }
    }

    updateSummary() {
        const summary = document.getElementById('workout-summary');
        if (this.exercises.length === 0) {
            summary.style.display = 'none';
            return;
        }

        summary.style.display = 'block';
        
        const totalExercises = this.exercises.length;
        let totalSets = 0;
        let totalReps = 0;
        let totalWeight = 0;

        this.exercises.forEach(exercise => {
            if (exercise.type === 'strength' && exercise.sets) {
                exercise.sets.forEach(set => {
                    totalSets++;
                    totalReps += set.reps || 0;
                    totalWeight += set.weight || 0;
                });
            }
        });

        document.getElementById('total-exercises').textContent = totalExercises;
        document.getElementById('total-sets').textContent = totalSets;
        document.getElementById('total-reps').textContent = totalReps;
        document.getElementById('total-weight').textContent = totalWeight > 0 ? `${totalWeight} lbs` : '0 lbs';
    }

    setupDeleteListeners() {
        // Delete listeners are set up inline in the HTML for simplicity
    }

    saveExercisesToStorage() {
        const key = `workout_${this.currentDate}`;
        localStorage.setItem(key, JSON.stringify(this.exercises));
    }

    loadExercisesFromStorage() {
        const key = `workout_${this.currentDate}`;
        const stored = localStorage.getItem(key);
        this.exercises = stored ? JSON.parse(stored) : [];
    }

    saveWorkoutToCSV() {
        if (this.exercises.length === 0) {
            this.showMessage('No exercises to save!', 'error');
            return;
        }

        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        const filename = `workout_${this.currentDate.replace(/-/g, '_')}.csv`;
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showMessage(`Workout saved as ${filename}!`, 'success');
    }

    generateCSV() {
        const headers = [
            'Exercise Name',
            'Exercise Type',
            'Set Number',
            'Weight (lbs)',
            'Reps',
            'Duration (min)',
            'Distance (miles)',
            'Notes',
            'Timestamp'
        ];

        const csvRows = [headers.join(',')];

        this.exercises.forEach(exercise => {
            if (exercise.type === 'strength' && exercise.sets) {
                // Create a row for each set
                exercise.sets.forEach((set, index) => {
                    const row = [
                        `"${exercise.name}"`,
                        exercise.type,
                        index + 1,
                        set.weight || '',
                        set.reps || '',
                        '',
                        '',
                        `"${exercise.notes || ''}"`,
                        exercise.timestamp
                    ];
                    csvRows.push(row.join(','));
                });
            } else {
                // Create a single row for non-strength exercises
                const row = [
                    `"${exercise.name}"`,
                    exercise.type,
                    '',
                    '',
                    '',
                    exercise.duration || '',
                    exercise.distance || '',
                    `"${exercise.notes || ''}"`,
                    exercise.timestamp
                ];
                csvRows.push(row.join(','));
            }
        });

        return csvRows.join('\n');
    }

    clearWorkout() {
        if (this.exercises.length === 0) {
            this.showMessage('No exercises to clear!', 'error');
            return;
        }

        if (confirm('Are you sure you want to clear all exercises for today?')) {
            this.exercises = [];
            this.saveExercisesToStorage();
            this.updateDisplay();
            this.showMessage('Workout cleared successfully!', 'success');
        }
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
    window.workoutTracker = new WorkoutTracker();
});

// Add some helpful keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to add exercise
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (window.workoutTracker) {
            window.workoutTracker.addExercise();
        }
    }
    
    // Ctrl/Cmd + S to save workout
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (window.workoutTracker) {
            window.workoutTracker.saveWorkoutToCSV();
        }
    }
}); 
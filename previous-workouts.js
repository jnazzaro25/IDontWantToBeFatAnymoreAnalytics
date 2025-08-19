// Previous Workouts Page
class PreviousWorkouts {
    constructor() {
        this.allWorkouts = [];
        this.filteredWorkouts = [];
        this.init();
    }

    init() {
        this.loadSampleData();
        this.setupEventListeners();
        this.updateDisplay();
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('search-exercise').addEventListener('input', (e) => {
            this.filterWorkouts();
        });

        // Filter controls
        document.getElementById('filter-type').addEventListener('change', () => {
            this.filterWorkouts();
        });

        document.getElementById('filter-date').addEventListener('change', () => {
            this.filterWorkouts();
        });

        // Clear filters
        document.getElementById('clear-filters').addEventListener('click', () => {
            this.clearFilters();
        });

        // Export buttons
        document.getElementById('export-all-csv').addEventListener('click', () => {
            this.exportAllToCSV();
        });

        document.getElementById('export-filtered-csv').addEventListener('click', () => {
            this.exportFilteredToCSV();
        });
    }

    loadSampleData() {
        // Sample workout data based on the CSV files in the repository
        this.allWorkouts = [
            {
                id: 1,
                name: "Bench Press",
                type: "strength",
                sets: 4,
                reps: 8,
                weight: 185,
                duration: 0,
                distance: 0,
                notes: "Felt strong today, good form throughout",
                timestamp: "2024-01-15T10:30:00.000Z",
                date: "2024-01-15",
                workoutId: "W001"
            },
            {
                id: 2,
                name: "Squats",
                type: "strength",
                sets: 4,
                reps: 10,
                weight: 225,
                duration: 0,
                distance: 0,
                notes: "Deep squats, focused on form",
                timestamp: "2024-01-15T10:45:00.000Z",
                date: "2024-01-15",
                workoutId: "W001"
            },
            {
                id: 3,
                name: "Running",
                type: "cardio",
                sets: 0,
                reps: 0,
                weight: 0,
                duration: 25,
                distance: 3.1,
                notes: "5K run, maintained 8:00 pace",
                timestamp: "2024-01-15T11:00:00.000Z",
                date: "2024-01-15",
                workoutId: "W001"
            },
            {
                id: 4,
                name: "Pull-ups",
                type: "strength",
                sets: 3,
                reps: 12,
                weight: 0,
                duration: 0,
                distance: 0,
                notes: "Bodyweight, full range of motion",
                timestamp: "2024-01-15T11:15:00.000Z",
                date: "2024-01-15",
                workoutId: "W001"
            },
            {
                id: 5,
                name: "Deadlifts",
                type: "strength",
                sets: 3,
                reps: 5,
                weight: 315,
                duration: 0,
                distance: 0,
                notes: "Heavy day, good form",
                timestamp: "2024-01-17T11:30:00.000Z",
                date: "2024-01-17",
                workoutId: "W002"
            },
            {
                id: 6,
                name: "Push-ups",
                type: "strength",
                sets: 3,
                reps: 20,
                weight: 0,
                duration: 0,
                distance: 0,
                notes: "Perfect form, full range",
                timestamp: "2024-01-17T11:45:00.000Z",
                date: "2024-01-17",
                workoutId: "W002"
            },
            {
                id: 7,
                name: "Swimming",
                type: "cardio",
                sets: 0,
                reps: 0,
                weight: 0,
                duration: 45,
                distance: 1.5,
                notes: "Freestyle, felt great",
                timestamp: "2024-01-17T12:00:00.000Z",
                date: "2024-01-17",
                workoutId: "W002"
            },
            {
                id: 8,
                name: "Overhead Press",
                type: "strength",
                sets: 4,
                reps: 6,
                weight: 135,
                duration: 0,
                distance: 0,
                notes: "Shoulder day, moderate weight",
                timestamp: "2024-01-19T10:30:00.000Z",
                date: "2024-01-19",
                workoutId: "W003"
            },
            {
                id: 9,
                name: "Barbell Rows",
                type: "strength",
                sets: 4,
                reps: 8,
                weight: 155,
                duration: 0,
                distance: 0,
                notes: "Back focus, good mind-muscle connection",
                timestamp: "2024-01-19T10:45:00.000Z",
                date: "2024-01-19",
                workoutId: "W003"
            },
            {
                id: 10,
                name: "Cycling",
                type: "cardio",
                sets: 0,
                reps: 0,
                weight: 0,
                duration: 30,
                distance: 12.5,
                notes: "Indoor cycling, high intensity",
                timestamp: "2024-01-19T11:00:00.000Z",
                date: "2024-01-19",
                workoutId: "W003"
            },
            {
                id: 11,
                name: "Bench Press",
                type: "strength",
                sets: 4,
                reps: 8,
                weight: 190,
                duration: 0,
                distance: 0,
                notes: "Progressive overload, felt strong",
                timestamp: "2024-01-22T10:30:00.000Z",
                date: "2024-01-22",
                workoutId: "W004"
            },
            {
                id: 12,
                name: "Squats",
                type: "strength",
                sets: 4,
                reps: 10,
                weight: 230,
                duration: 0,
                distance: 0,
                notes: "Weight increase, maintained form",
                timestamp: "2024-01-22T10:45:00.000Z",
                date: "2024-01-22",
                workoutId: "W004"
            },
            {
                id: 13,
                name: "Jump Rope",
                type: "cardio",
                sets: 0,
                reps: 0,
                weight: 0,
                duration: 15,
                distance: 0,
                notes: "High intensity intervals",
                timestamp: "2024-01-22T11:00:00.000Z",
                date: "2024-01-22",
                workoutId: "W004"
            },
            {
                id: 14,
                name: "Deadlifts",
                type: "strength",
                sets: 3,
                reps: 5,
                weight: 320,
                duration: 0,
                distance: 0,
                notes: "New PR! Great form",
                timestamp: "2024-01-24T11:30:00.000Z",
                date: "2024-01-24",
                workoutId: "W005"
            },
            {
                id: 15,
                name: "Pull-ups",
                type: "strength",
                sets: 3,
                reps: 15,
                weight: 0,
                duration: 0,
                distance: 0,
                notes: "Increased reps, feeling stronger",
                timestamp: "2024-01-24T11:45:00.000Z",
                date: "2024-01-24",
                workoutId: "W005"
            },
            {
                id: 16,
                name: "Running",
                type: "cardio",
                sets: 0,
                reps: 0,
                weight: 0,
                duration: 20,
                distance: 2.5,
                notes: "Easy pace, recovery run",
                timestamp: "2024-01-24T12:00:00.000Z",
                date: "2024-01-24",
                workoutId: "W005"
            },
            {
                id: 17,
                name: "Overhead Press",
                type: "strength",
                sets: 4,
                reps: 6,
                weight: 140,
                duration: 0,
                distance: 0,
                notes: "Progressive overload",
                timestamp: "2024-01-26T10:30:00.000Z",
                date: "2024-01-26",
                workoutId: "W006"
            },
            {
                id: 18,
                name: "Barbell Rows",
                type: "strength",
                sets: 4,
                reps: 8,
                weight: 160,
                duration: 0,
                distance: 0,
                notes: "Back strength improving",
                timestamp: "2024-01-26T10:45:00.000Z",
                date: "2024-01-26",
                workoutId: "W006"
            },
            {
                id: 19,
                name: "Yoga",
                type: "flexibility",
                sets: 0,
                reps: 0,
                weight: 0,
                duration: 60,
                distance: 0,
                notes: "Morning flow, great stretch",
                timestamp: "2024-01-26T11:00:00.000Z",
                date: "2024-01-26",
                workoutId: "W006"
            }
        ];

        // Sort by date (newest first)
        this.allWorkouts.sort((a, b) => new Date(b.date) - new Date(a.date));
        this.filteredWorkouts = [...this.allWorkouts];
    }

    loadAllWorkouts() {
        // This method now loads sample data instead of localStorage
        // In a real application, you would load from localStorage or API
        this.loadSampleData();
    }

    generateWorkoutId(date) {
        const workoutDate = new Date(date);
        const weekNumber = this.getWeekNumber(workoutDate);
        const month = workoutDate.toLocaleString('default', { month: 'short' });
        const year = workoutDate.getFullYear();
        return `W${weekNumber}-${month}${year}`;
    }

    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    filterWorkouts() {
        const searchTerm = document.getElementById('search-exercise').value.toLowerCase();
        const filterType = document.getElementById('filter-type').value;
        const filterDate = document.getElementById('filter-date').value;

        this.filteredWorkouts = this.allWorkouts.filter(workout => {
            // Search filter
            const matchesSearch = workout.name.toLowerCase().includes(searchTerm);
            
            // Type filter
            const matchesType = !filterType || workout.type === filterType;
            
            // Date filter
            let matchesDate = true;
            if (filterDate) {
                const workoutDate = new Date(workout.date);
                const daysAgo = (Date.now() - workoutDate.getTime()) / (1000 * 60 * 60 * 24);
                matchesDate = daysAgo <= parseInt(filterDate);
            }
            
            return matchesSearch && matchesType && matchesDate;
        });

        this.updateDisplay();
    }

    clearFilters() {
        document.getElementById('search-exercise').value = '';
        document.getElementById('filter-type').value = '';
        document.getElementById('filter-date').value = '';
        this.filteredWorkouts = [...this.allWorkouts];
        this.updateDisplay();
    }

    updateDisplay() {
        this.updateStats();
        this.updateWorkoutTimeline();
    }

    updateStats() {
        const uniqueDates = new Set(this.filteredWorkouts.map(w => w.date));
        
        document.getElementById('total-workouts').textContent = uniqueDates.size;
        document.getElementById('total-exercises').textContent = this.filteredWorkouts.length;
        document.getElementById('total-days').textContent = uniqueDates.size;
    }

    updateWorkoutTimeline() {
        const container = document.getElementById('workout-timeline');
        
        if (this.filteredWorkouts.length === 0) {
            container.innerHTML = `
                <div class="no-workouts">
                    <i class="fas fa-calendar-times"></i>
                    <p>No workouts found matching your filters.</p>
                </div>
            `;
            return;
        }

        // Group workouts by date
        const workoutsByDate = this.groupWorkoutsByDate();
        
        const timelineHTML = Object.keys(workoutsByDate)
            .sort((a, b) => new Date(b) - new Date(a))
            .map(date => this.createDateGroupHTML(date, workoutsByDate[date]))
            .join('');

        container.innerHTML = timelineHTML;
    }

    groupWorkoutsByDate() {
        const grouped = {};
        
        this.filteredWorkouts.forEach(workout => {
            if (!grouped[workout.date]) {
                grouped[workout.date] = [];
            }
            grouped[workout.date].push(workout);
        });
        
        return grouped;
    }

    createDateGroupHTML(date, workouts) {
        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const workoutItems = workouts.map(workout => this.createWorkoutItemHTML(workout)).join('');

        return `
            <div class="date-group">
                <div class="date-header">
                    <h3>${formattedDate}</h3>
                    <span class="workout-count">${workouts.length} exercise${workouts.length > 1 ? 's' : ''}</span>
                </div>
                <div class="workout-items">
                    ${workoutItems}
                </div>
            </div>
        `;
    }

    createWorkoutItemHTML(workout) {
        const details = [];
        
        if (workout.type === 'strength') {
            if (workout.sets > 0) details.push(`${workout.sets} sets`);
            if (workout.reps > 0) details.push(`${workout.reps} reps`);
            if (workout.weight > 0) details.push(`${workout.weight} lbs`);
        } else if (workout.type === 'cardio') {
            if (workout.duration > 0) details.push(`${workout.duration} min`);
            if (workout.distance > 0) details.push(`${workout.distance} mi`);
        }

        const detailsText = details.length > 0 ? details.join(' • ') : '';

        return `
            <div class="workout-item">
                <div class="workout-header">
                    <span class="workout-name">${workout.name}</span>
                    <span class="workout-type">${workout.type}</span>
                </div>
                ${detailsText ? `<div class="workout-details">${detailsText}</div>` : ''}
                ${workout.notes ? `<div class="workout-notes">${workout.notes}</div>` : ''}
            </div>
        `;
    }

    exportAllToCSV() {
        this.exportToCSV(this.allWorkouts, 'all_workouts');
    }

    exportFilteredToCSV() {
        this.exportToCSV(this.filteredWorkouts, 'filtered_workouts');
    }

    exportToCSV(workouts, filename) {
        if (workouts.length === 0) {
            this.showMessage('No workouts to export!', 'error');
            return;
        }

        const headers = [
            'Date',
            'Workout ID',
            'Exercise Name',
            'Exercise Type',
            'Sets',
            'Reps',
            'Weight (lbs)',
            'Duration (min)',
            'Distance (miles)',
            'Notes',
            'Timestamp'
        ];

        const csvRows = [headers.join(',')];

        workouts.forEach(workout => {
            const row = [
                workout.date,
                workout.workoutId || '',
                `"${workout.name}"`,
                workout.type,
                workout.sets || '',
                workout.reps || '',
                workout.weight || '',
                workout.duration || '',
                workout.distance || '',
                `"${workout.notes || ''}"`,
                workout.timestamp
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        const timestamp = new Date().toISOString().split('T')[0];
        const finalFilename = `${filename}_${timestamp}.csv`;
        
        link.href = URL.createObjectURL(blob);
        link.download = finalFilename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showMessage(`Exported ${workouts.length} workouts to ${finalFilename}!`, 'success');
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
    window.previousWorkouts = new PreviousWorkouts();
}); 
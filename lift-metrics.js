// Lift Metrics Page
class LiftMetrics {
    constructor() {
        this.allWorkouts = [];
        this.selectedExercise = null;
        this.selectedMetric = 'weight';
        this.timeRange = 30;
        this.chart = null;
        this.init();
    }

    init() {
        this.loadSampleData();
        this.setupEventListeners();
        this.populateExerciseSelector();
    }

    setupEventListeners() {
        // Exercise selector
        document.getElementById('exercise-selector').addEventListener('change', (e) => {
            this.selectedExercise = e.target.value;
            this.updateAnalysis();
        });

        // Metric selector
        document.getElementById('metric-selector').addEventListener('change', (e) => {
            this.selectedMetric = e.target.value;
            this.updateAnalysis();
        });

        // Time range selector
        document.getElementById('time-range').addEventListener('change', (e) => {
            this.timeRange = e.target.value;
            this.updateAnalysis();
        });

        // Export buttons
        document.getElementById('export-performance-csv').addEventListener('click', () => {
            this.exportPerformanceToCSV();
        });

        document.getElementById('export-chart').addEventListener('click', () => {
            this.exportChart();
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
                date: "2024-01-15"
            },
            {
                id: 2,
                name: "Bench Press",
                type: "strength",
                sets: 4,
                reps: 8,
                weight: 190,
                duration: 0,
                distance: 0,
                notes: "Progressive overload, felt strong",
                timestamp: "2024-01-22T10:30:00.000Z",
                date: "2024-01-22"
            },
            {
                id: 3,
                name: "Bench Press",
                type: "strength",
                sets: 4,
                reps: 8,
                weight: 195,
                duration: 0,
                distance: 0,
                notes: "Continuing to progress",
                timestamp: "2024-01-29T10:30:00.000Z",
                date: "2024-01-29"
            },
            {
                id: 4,
                name: "Squats",
                type: "strength",
                sets: 4,
                reps: 10,
                weight: 225,
                duration: 0,
                distance: 0,
                notes: "Deep squats, focused on form",
                timestamp: "2024-01-15T10:45:00.000Z",
                date: "2024-01-15"
            },
            {
                id: 5,
                name: "Squats",
                type: "strength",
                sets: 4,
                reps: 10,
                weight: 230,
                duration: 0,
                distance: 0,
                notes: "Weight increase, maintained form",
                timestamp: "2024-01-22T10:45:00.000Z",
                date: "2024-01-22"
            },
            {
                id: 6,
                name: "Squats",
                type: "strength",
                sets: 4,
                reps: 10,
                weight: 235,
                duration: 0,
                distance: 0,
                notes: "Feeling stronger each week",
                timestamp: "2024-01-29T10:45:00.000Z",
                date: "2024-01-29"
            },
            {
                id: 7,
                name: "Deadlifts",
                type: "strength",
                sets: 3,
                reps: 5,
                weight: 315,
                duration: 0,
                distance: 0,
                notes: "Heavy day, good form",
                timestamp: "2024-01-17T11:30:00.000Z",
                date: "2024-01-17"
            },
            {
                id: 8,
                name: "Deadlifts",
                type: "strength",
                sets: 3,
                reps: 5,
                weight: 320,
                duration: 0,
                distance: 0,
                notes: "New PR! Great form",
                timestamp: "2024-01-24T11:30:00.000Z",
                date: "2024-01-24"
            },
            {
                id: 9,
                name: "Deadlifts",
                type: "strength",
                sets: 3,
                reps: 5,
                weight: 325,
                duration: 0,
                distance: 0,
                notes: "Another PR! Form is solid",
                timestamp: "2024-01-31T11:30:00.000Z",
                date: "2024-01-31"
            },
            {
                id: 10,
                name: "Running",
                type: "cardio",
                sets: 0,
                reps: 0,
                weight: 0,
                duration: 25,
                distance: 3.1,
                notes: "5K run, maintained 8:00 pace",
                timestamp: "2024-01-15T11:00:00.000Z",
                date: "2024-01-15"
            },
            {
                id: 11,
                name: "Running",
                type: "cardio",
                sets: 0,
                reps: 0,
                weight: 0,
                duration: 24,
                distance: 3.1,
                notes: "5K run, improved pace to 7:45",
                timestamp: "2024-01-22T11:00:00.000Z",
                date: "2024-01-22"
            },
            {
                id: 12,
                name: "Running",
                type: "cardio",
                sets: 0,
                reps: 0,
                weight: 0,
                duration: 23,
                distance: 3.1,
                notes: "5K run, new PR at 7:30 pace!",
                timestamp: "2024-01-29T11:00:00.000Z",
                date: "2024-01-29"
            },
            {
                id: 13,
                name: "Pull-ups",
                type: "strength",
                sets: 3,
                reps: 12,
                weight: 0,
                duration: 0,
                distance: 0,
                notes: "Bodyweight, full range of motion",
                timestamp: "2024-01-15T11:15:00.000Z",
                date: "2024-01-15"
            },
            {
                id: 14,
                name: "Pull-ups",
                type: "strength",
                sets: 3,
                reps: 15,
                weight: 0,
                duration: 0,
                distance: 0,
                notes: "Increased reps, feeling stronger",
                timestamp: "2024-01-24T11:45:00.000Z",
                date: "2024-01-24"
            },
            {
                id: 15,
                name: "Pull-ups",
                type: "strength",
                sets: 3,
                reps: 18,
                weight: 0,
                duration: 0,
                distance: 0,
                notes: "Continuing to improve!",
                timestamp: "2024-02-02T11:45:00.000Z",
                date: "2024-02-02"
            },
            {
                id: 16,
                name: "Overhead Press",
                type: "strength",
                sets: 4,
                reps: 6,
                weight: 135,
                duration: 0,
                distance: 0,
                notes: "Shoulder day, moderate weight",
                timestamp: "2024-01-19T10:30:00.000Z",
                date: "2024-01-19"
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
                date: "2024-01-26"
            },
            {
                id: 18,
                name: "Overhead Press",
                type: "strength",
                sets: 4,
                reps: 6,
                weight: 145,
                duration: 0,
                distance: 0,
                notes: "Slow and steady progress",
                timestamp: "2024-02-02T10:30:00.000Z",
                date: "2024-02-02"
            }
        ];

        // Sort by date (oldest first for charts)
        this.allWorkouts.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    loadAllWorkouts() {
        // This method now loads sample data instead of localStorage
        // In a real application, you would load from localStorage or API
        this.loadSampleData();
    }

    populateExerciseSelector() {
        const selector = document.getElementById('exercise-selector');
        const exercises = [...new Set(this.allWorkouts.map(w => w.name))].sort();
        
        selector.innerHTML = '<option value="">Choose an exercise...</option>';
        exercises.forEach(exercise => {
            const option = document.createElement('option');
            option.value = exercise;
            option.textContent = exercise;
            selector.appendChild(option);
        });
    }

    updateAnalysis() {
        if (!this.selectedExercise) {
            this.hideAllSections();
            return;
        }

        const exerciseData = this.getExerciseData();
        if (exerciseData.length === 0) {
            this.hideAllSections();
            return;
        }

        this.showAllSections();
        this.updatePerformanceSummary(exerciseData);
        this.updateProgressChart(exerciseData);
        this.updatePerformanceTable(exerciseData);
        this.updateInsights(exerciseData);
    }

    getExerciseData() {
        const now = new Date();
        const cutoffDate = new Date();
        
        if (this.timeRange !== 'all') {
            cutoffDate.setDate(now.getDate() - parseInt(this.timeRange));
        } else {
            cutoffDate.setFullYear(1900); // Very old date to include all
        }

        return this.allWorkouts.filter(workout => 
            workout.name === this.selectedExercise && 
            new Date(workout.date) >= cutoffDate
        );
    }

    updatePerformanceSummary(exerciseData) {
        const currentBest = this.getCurrentBest(exerciseData);
        const personalRecord = this.getPersonalRecord(exerciseData);
        const average = this.getAverage(exerciseData);
        const improvement = this.getImprovement(exerciseData);

        document.getElementById('current-best').textContent = this.formatMetric(currentBest);
        document.getElementById('personal-record').textContent = this.formatMetric(personalRecord);
        document.getElementById('average-performance').textContent = this.formatMetric(average);
        document.getElementById('improvement').textContent = improvement;
    }

    getCurrentBest(exerciseData) {
        if (this.selectedMetric === 'volume') {
            return Math.max(...exerciseData.map(w => (w.weight || 0) * (w.reps || 0) * (w.sets || 0)));
        } else if (this.selectedMetric === 'max-weight') {
            return Math.max(...exerciseData.map(w => w.weight || 0));
        } else {
            return Math.max(...exerciseData.map(w => w[this.selectedMetric] || 0));
        }
    }

    getPersonalRecord(exerciseData) {
        // Get the best performance from all time data
        const allTimeData = this.allWorkouts.filter(w => w.name === this.selectedExercise);
        if (this.selectedMetric === 'volume') {
            return Math.max(...allTimeData.map(w => (w.weight || 0) * (w.reps || 0) * (w.sets || 0)));
        } else if (this.selectedMetric === 'max-weight') {
            return Math.max(...allTimeData.map(w => w.weight || 0));
        } else {
            return Math.max(...allTimeData.map(w => w[this.selectedMetric] || 0));
        }
    }

    getAverage(exerciseData) {
        const values = exerciseData.map(w => {
            if (this.selectedMetric === 'volume') {
                return (w.weight || 0) * (w.reps || 0) * (w.sets || 0);
            } else if (this.selectedMetric === 'max-weight') {
                return w.weight || 0;
            } else {
                return w[this.selectedMetric] || 0;
            }
        }).filter(v => v > 0);

        if (values.length === 0) return 0;
        return values.reduce((sum, val) => sum + val, 0) / values.length;
    }

    getImprovement(exerciseData) {
        if (exerciseData.length < 2) return 'N/A';
        
        const first = exerciseData[0];
        const last = exerciseData[exerciseData.length - 1];
        
        let firstValue, lastValue;
        
        if (this.selectedMetric === 'volume') {
            firstValue = (first.weight || 0) * (first.reps || 0) * (first.sets || 0);
            lastValue = (last.weight || 0) * (last.reps || 0) * (last.sets || 0);
        } else if (this.selectedMetric === 'max-weight') {
            firstValue = first.weight || 0;
            lastValue = last.weight || 0;
        } else {
            firstValue = first[this.selectedMetric] || 0;
            lastValue = last[this.selectedMetric] || 0;
        }
        
        if (firstValue === 0) return 'N/A';
        
        const percentage = ((lastValue - firstValue) / firstValue) * 100;
        return `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;
    }

    formatMetric(value) {
        if (this.selectedMetric === 'volume') {
            return `${Math.round(value)} lbs`;
        } else if (this.selectedMetric === 'weight' || this.selectedMetric === 'max-weight') {
            return `${value} lbs`;
        } else if (this.selectedMetric === 'duration') {
            return `${value} min`;
        } else if (this.selectedMetric === 'distance') {
            return `${value} mi`;
        } else {
            return value.toString();
        }
    }

    updateProgressChart(exerciseData) {
        const ctx = document.getElementById('progress-canvas').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }

        const labels = exerciseData.map(w => w.date);
        const data = exerciseData.map(w => {
            if (this.selectedMetric === 'volume') {
                return (w.weight || 0) * (w.reps || 0) * (w.sets || 0);
            } else if (this.selectedMetric === 'max-weight') {
                return w.weight || 0;
            } else {
                return w[this.selectedMetric] || 0;
            }
        });

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: this.getMetricLabel(),
                    data: data,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `${this.selectedExercise} - ${this.getMetricLabel()} Progress`
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: this.getMetricLabel()
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                }
            }
        });
    }

    getMetricLabel() {
        const labels = {
            'weight': 'Weight (lbs)',
            'reps': 'Reps',
            'sets': 'Sets',
            'volume': 'Volume (lbs)',
            'max-weight': 'Max Weight (lbs)',
            'duration': 'Duration (min)',
            'distance': 'Distance (miles)'
        };
        return labels[this.selectedMetric] || this.selectedMetric;
    }

    updatePerformanceTable(exerciseData) {
        const tbody = document.getElementById('performance-tbody');
        
        const rows = exerciseData.map(workout => {
            const volume = (workout.weight || 0) * (workout.reps || 0) * (workout.sets || 0);
            return `
                <tr>
                    <td>${workout.date}</td>
                    <td>${workout.sets || '-'}</td>
                    <td>${workout.reps || '-'}</td>
                    <td>${workout.weight || '-'}</td>
                    <td>${volume > 0 ? volume : '-'}</td>
                    <td>${workout.notes || '-'}</td>
                </tr>
            `;
        }).join('');

        tbody.innerHTML = rows;
    }

    updateInsights(exerciseData) {
        const progressTrend = this.getProgressTrend(exerciseData);
        const workoutFrequency = this.getWorkoutFrequency(exerciseData);
        const recommendations = this.getRecommendations(exerciseData);

        document.getElementById('progress-trend').textContent = progressTrend;
        document.getElementById('workout-frequency').textContent = workoutFrequency;
        document.getElementById('recommendations').textContent = recommendations;
    }

    getProgressTrend(exerciseData) {
        if (exerciseData.length < 2) return 'Not enough data';
        
        const first = exerciseData[0];
        const last = exerciseData[exerciseData.length - 1];
        
        let firstValue, lastValue;
        
        if (this.selectedMetric === 'volume') {
            firstValue = (first.weight || 0) * (first.reps || 0) * (first.sets || 0);
            lastValue = (last.weight || 0) * (last.reps || 0) * (last.sets || 0);
        } else if (this.selectedMetric === 'max-weight') {
            firstValue = first.weight || 0;
            lastValue = last.weight || 0;
        } else {
            firstValue = first[this.selectedMetric] || 0;
            lastValue = last[this.selectedMetric] || 0;
        }
        
        if (lastValue > firstValue) return 'Improving';
        if (lastValue < firstValue) return 'Declining';
        return 'Stable';
    }

    getWorkoutFrequency(exerciseData) {
        if (exerciseData.length < 2) return 'Not enough data';
        
        const firstDate = new Date(exerciseData[0].date);
        const lastDate = new Date(exerciseData[exerciseData.length - 1].date);
        const daysDiff = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
        const frequency = exerciseData.length / (daysDiff / 7);
        
        if (frequency >= 3) return 'High (3+ times/week)';
        if (frequency >= 2) return 'Moderate (2 times/week)';
        if (frequency >= 1) return 'Low (1 time/week)';
        return 'Very Low (<1 time/week)';
    }

    getRecommendations(exerciseData) {
        if (exerciseData.length < 3) return 'Continue tracking to get personalized recommendations';
        
        const trend = this.getProgressTrend(exerciseData);
        const frequency = this.getWorkoutFrequency(exerciseData);
        
        if (trend === 'Improving' && frequency.includes('High')) {
            return 'Great progress! Consider increasing intensity or adding variations';
        } else if (trend === 'Improving' && frequency.includes('Low')) {
            return 'Good progress! Try increasing frequency to 2-3 times/week';
        } else if (trend === 'Declining') {
            return 'Consider deloading, checking form, or adjusting programming';
        } else if (trend === 'Stable') {
            return 'Try progressive overload or increasing volume gradually';
        }
        
        return 'Focus on consistency and progressive overload';
    }

    hideAllSections() {
        document.getElementById('performance-summary').style.display = 'none';
        document.getElementById('progress-chart').style.display = 'none';
        document.getElementById('performance-data').style.display = 'none';
        document.getElementById('insights').style.display = 'none';
        document.getElementById('export-performance').style.display = 'none';
    }

    showAllSections() {
        document.getElementById('performance-summary').style.display = 'block';
        document.getElementById('progress-chart').style.display = 'block';
        document.getElementById('performance-data').style.display = 'block';
        document.getElementById('insights').style.display = 'block';
        document.getElementById('export-performance').style.display = 'block';
    }

    exportPerformanceToCSV() {
        if (!this.selectedExercise) {
            this.showMessage('Please select an exercise first!', 'error');
            return;
        }

        const exerciseData = this.getExerciseData();
        if (exerciseData.length === 0) {
            this.showMessage('No data to export!', 'error');
            return;
        }

        const headers = [
            'Date',
            'Exercise Name',
            'Sets',
            'Reps',
            'Weight (lbs)',
            'Volume (lbs)',
            'Notes'
        ];

        const csvRows = [headers.join(',')];

        exerciseData.forEach(workout => {
            const volume = (workout.weight || 0) * (workout.reps || 0) * (workout.sets || 0);
            const row = [
                workout.date,
                `"${workout.name}"`,
                workout.sets || '',
                workout.reps || '',
                workout.weight || '',
                volume > 0 ? volume : '',
                `"${workout.notes || ''}"`
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `${this.selectedExercise.replace(/\s+/g, '_')}_performance_${timestamp}.csv`;
        
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showMessage(`Exported ${exerciseData.length} performance records to ${filename}!`, 'success');
    }

    exportChart() {
        if (!this.chart) {
            this.showMessage('No chart to export!', 'error');
            return;
        }

        const canvas = document.getElementById('progress-canvas');
        const link = document.createElement('a');
        link.download = `${this.selectedExercise.replace(/\s+/g, '_')}_chart.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        this.showMessage('Chart exported successfully!', 'success');
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
    window.liftMetrics = new LiftMetrics();
}); 
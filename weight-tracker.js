// Weight Tracker Application
class WeightTracker {
    constructor() {
        this.weightEntries = [];
        this.filteredEntries = [];
        this.charts = {};
        this.init();
    }

    init() {
        this.setCurrentDate();
        this.loadWeightEntriesFromStorage();
        this.setupEventListeners();
        this.updateDisplay();
        this.updateCharts();
    }

    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('weight-date').value = today;
    }

    setupEventListeners() {
        // Add weight entry
        document.getElementById('add-weight-entry').addEventListener('click', () => {
            this.addWeightEntry();
        });

        // Clear form
        document.getElementById('clear-weight-form').addEventListener('click', () => {
            this.clearWeightForm();
        });

        // Search functionality
        document.getElementById('search-weight').addEventListener('input', (e) => {
            this.filterWeightEntries();
        });

        // Time range filter
        document.getElementById('filter-time-range').addEventListener('change', () => {
            this.filterWeightEntries();
        });

        // Clear filters
        document.getElementById('clear-weight-filters').addEventListener('click', () => {
            this.clearWeightFilters();
        });

        // Export buttons
        document.getElementById('export-weight-csv').addEventListener('click', () => {
            this.exportToCSV();
        });

        document.getElementById('export-weight-json').addEventListener('click', () => {
            this.exportToJSON();
        });

        // Auto-calculate BMI when height changes
        document.getElementById('height').addEventListener('input', () => {
            this.calculateBMI();
        });

        // Auto-calculate body fat in pounds when percentage changes
        document.getElementById('body-fat').addEventListener('input', () => {
            this.calculateBodyFatLbs();
        });

        // Auto-calculate lean mass when weight and body fat change
        document.getElementById('body-weight').addEventListener('input', () => {
            this.calculateBodyComposition();
        });

        document.getElementById('body-fat').addEventListener('input', () => {
            this.calculateBodyComposition();
        });

        // Enter key support
        const formInputs = document.querySelectorAll('.weight-entry-form input, .weight-entry-form select, .weight-entry-form textarea');
        formInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addWeightEntry();
                }
            });
        });
    }

    calculateBMI() {
        const weight = parseFloat(document.getElementById('body-weight').value) || 0;
        const height = parseFloat(document.getElementById('height').value) || 0;
        
        if (weight > 0 && height > 0) {
            // Convert height from inches to meters and weight from lbs to kg
            const heightMeters = height * 0.0254;
            const weightKg = weight * 0.453592;
            
            const bmi = weightKg / (heightMeters * heightMeters);
            document.getElementById('bmi').value = bmi.toFixed(1);
        }
    }

    calculateBodyFatLbs() {
        const weight = parseFloat(document.getElementById('body-weight').value) || 0;
        const bodyFatPercent = parseFloat(document.getElementById('body-fat').value) || 0;
        
        if (weight > 0 && bodyFatPercent > 0) {
            const bodyFatLbs = (weight * bodyFatPercent) / 100;
            document.getElementById('body-fat-lbs').value = bodyFatLbs.toFixed(1);
        }
    }

    calculateBodyComposition() {
        const weight = parseFloat(document.getElementById('body-weight').value) || 0;
        const bodyFatPercent = parseFloat(document.getElementById('body-fat').value) || 0;
        
        if (weight > 0 && bodyFatPercent > 0) {
            const bodyFatLbs = (weight * bodyFatPercent) / 100;
            const leanMass = weight - bodyFatLbs;
            
            document.getElementById('body-fat-lbs').value = bodyFatLbs.toFixed(1);
            document.getElementById('lean-mass').value = leanMass.toFixed(1);
        }
    }

    addWeightEntry() {
        const date = document.getElementById('weight-date').value;
        const bodyWeight = parseFloat(document.getElementById('body-weight').value);
        
        if (!date) {
            this.showMessage('Please select a date', 'error');
            return;
        }

        if (!bodyWeight || bodyWeight < 50 || bodyWeight > 500) {
            this.showMessage('Please enter a valid body weight between 50-500 lbs', 'error');
            return;
        }

        // Check if entry already exists for this date
        const existingEntry = this.weightEntries.find(entry => entry.date === date);
        if (existingEntry) {
            if (confirm('An entry already exists for this date. Do you want to replace it?')) {
                this.weightEntries = this.weightEntries.filter(entry => entry.date !== date);
            } else {
                return;
            }
        }

        const entry = {
            id: Date.now(),
            date: date,
            bodyWeight: bodyWeight,
            bodyFat: parseFloat(document.getElementById('body-fat').value) || null,
            muscleMass: parseFloat(document.getElementById('muscle-mass').value) || null,
            bodyFatLbs: parseFloat(document.getElementById('body-fat-lbs').value) || null,
            leanMass: parseFloat(document.getElementById('lean-mass').value) || null,
            bmi: parseFloat(document.getElementById('bmi').value) || null,
            height: parseFloat(document.getElementById('height').value) || null,
            waist: parseFloat(document.getElementById('waist').value) || null,
            chest: parseFloat(document.getElementById('chest').value) || null,
            arms: parseFloat(document.getElementById('arms').value) || null,
            thighs: parseFloat(document.getElementById('thighs').value) || null,
            caloriesConsumed: parseInt(document.getElementById('calories-consumed').value) || null,
            waterIntake: parseInt(document.getElementById('water-intake').value) || null,
            sleepHours: parseFloat(document.getElementById('sleep-hours').value) || null,
            stressLevel: parseInt(document.getElementById('stress-level').value) || null,
            energyLevel: parseInt(document.getElementById('energy-level').value) || null,
            notes: document.getElementById('notes').value.trim(),
            timestamp: new Date().toISOString()
        };

        this.weightEntries.push(entry);
        this.saveWeightEntriesToStorage();
        this.updateDisplay();
        this.updateCharts();
        this.clearWeightForm();
        this.showMessage('Weight entry added successfully!', 'success');
    }

    clearWeightForm() {
        document.getElementById('weight-date').value = '';
        document.getElementById('body-weight').value = '';
        document.getElementById('body-fat').value = '';
        document.getElementById('muscle-mass').value = '';
        document.getElementById('body-fat-lbs').value = '';
        document.getElementById('lean-mass').value = '';
        document.getElementById('bmi').value = '';
        document.getElementById('height').value = '';
        document.getElementById('waist').value = '';
        document.getElementById('chest').value = '';
        document.getElementById('arms').value = '';
        document.getElementById('thighs').value = '';
        document.getElementById('calories-consumed').value = '';
        document.getElementById('water-intake').value = '';
        document.getElementById('sleep-hours').value = '';
        document.getElementById('stress-level').value = '';
        document.getElementById('energy-level').value = '';
        document.getElementById('notes').value = '';
        
        this.setCurrentDate();
        document.getElementById('body-weight').focus();
    }

    deleteWeightEntry(id) {
        this.weightEntries = this.weightEntries.filter(entry => entry.id !== id);
        this.saveWeightEntriesToStorage();
        this.updateDisplay();
        this.updateCharts();
        this.showMessage('Weight entry removed successfully!', 'success');
    }

    filterWeightEntries() {
        const searchTerm = document.getElementById('search-weight').value.toLowerCase();
        const timeRange = document.getElementById('filter-time-range').value;
        
        this.filteredEntries = this.weightEntries.filter(entry => {
            // Search filter
            const matchesSearch = !searchTerm || 
                entry.notes.toLowerCase().includes(searchTerm) ||
                entry.date.includes(searchTerm);
            
            // Time range filter
            let matchesTime = true;
            if (timeRange !== 'all') {
                const entryDate = new Date(entry.date);
                const daysAgo = (Date.now() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
                matchesTime = daysAgo <= parseInt(timeRange);
            }
            
            return matchesSearch && matchesTime;
        });

        this.updateWeightHistoryDisplay();
    }

    clearWeightFilters() {
        document.getElementById('search-weight').value = '';
        document.getElementById('filter-time-range').value = 'all';
        this.filteredEntries = [...this.weightEntries];
        this.updateWeightHistoryDisplay();
    }

    updateDisplay() {
        this.updateWeightSummary();
        this.updateWeightHistoryDisplay();
    }

    updateWeightSummary() {
        if (this.weightEntries.length === 0) {
            document.getElementById('weight-summary').style.display = 'none';
            return;
        }

        document.getElementById('weight-summary').style.display = 'block';
        
        // Sort entries by date (newest first)
        const sortedEntries = [...this.weightEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
        const currentEntry = sortedEntries[0];
        const startingEntry = sortedEntries[sortedEntries.length - 1];
        
        // Calculate total change
        const totalChange = currentEntry.bodyWeight - startingEntry.bodyWeight;
        const changeText = totalChange > 0 ? `+${totalChange.toFixed(1)} lbs` : `${totalChange.toFixed(1)} lbs`;
        
        // Calculate days tracked
        const firstDate = new Date(startingEntry.date);
        const lastDate = new Date(currentEntry.date);
        const daysTracked = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)) + 1;
        
        document.getElementById('current-weight').textContent = `${currentEntry.bodyWeight} lbs`;
        document.getElementById('starting-weight').textContent = `${startingEntry.bodyWeight} lbs`;
        document.getElementById('total-change').textContent = changeText;
        document.getElementById('current-body-fat').textContent = currentEntry.bodyFat ? `${currentEntry.bodyFat}%` : 'N/A';
        document.getElementById('total-entries').textContent = this.weightEntries.length;
        document.getElementById('days-tracked').textContent = daysTracked;
    }

    updateWeightHistoryDisplay() {
        const container = document.getElementById('weight-entries-container');
        const entries = this.filteredEntries.length > 0 ? this.filteredEntries : this.weightEntries;
        
        if (entries.length === 0) {
            container.innerHTML = `
                <div class="no-entries">
                    <i class="fas fa-weight-scale"></i>
                    <p>No weight entries found matching your filters.</p>
                </div>
            `;
            return;
        }

        // Sort by date (newest first)
        const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        container.innerHTML = sortedEntries.map(entry => this.createWeightEntryHTML(entry)).join('');
        this.setupDeleteListeners();
    }

    createWeightEntryHTML(entry) {
        const date = new Date(entry.date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const bodyFatText = entry.bodyFat ? `${entry.bodyFat}%` : 'N/A';
        const bmiText = entry.bmi ? entry.bmi.toFixed(1) : 'N/A';
        
        let measurementsText = '';
        if (entry.waist || entry.chest || entry.arms || entry.thighs) {
            const measurements = [];
            if (entry.waist) measurements.push(`Waist: ${entry.waist}"`);
            if (entry.chest) measurements.push(`Chest: ${entry.chest}"`);
            if (entry.arms) measurements.push(`Arms: ${entry.arms}"`);
            if (entry.thighs) measurements.push(`Thighs: ${entry.thighs}"`);
            measurementsText = measurements.join(', ');
        }

        return `
            <div class="weight-entry-item" data-id="${entry.id}">
                <div class="weight-entry-header">
                    <div class="weight-entry-date">
                        <h3>${date}</h3>
                        <span class="weight-value">${entry.bodyWeight} lbs</span>
                    </div>
                    <div class="weight-entry-actions">
                        <button class="delete-weight-entry" onclick="weightTracker.deleteWeightEntry(${entry.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="weight-entry-details">
                    <div class="detail-row">
                        <div class="detail-item">
                            <span class="detail-label">Body Fat</span>
                            <span class="detail-value">${bodyFatText}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">BMI</span>
                            <span class="detail-value">${bmiText}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Muscle Mass</span>
                            <span class="detail-value">${entry.muscleMass ? entry.muscleMass + ' lbs' : 'N/A'}</span>
                        </div>
                    </div>
                    
                    ${measurementsText ? `
                        <div class="measurements-row">
                            <span class="measurements-label">Measurements:</span>
                            <span class="measurements-value">${measurementsText}</span>
                        </div>
                    ` : ''}
                    
                    ${entry.notes ? `
                        <div class="weight-entry-notes">
                            <i class="fas fa-comment"></i>
                            ${entry.notes}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    setupDeleteListeners() {
        // Delete listeners are set up inline in the HTML for simplicity
    }

    updateCharts() {
        if (this.weightEntries.length === 0) return;
        
        this.updateWeightChart();
        this.updateBodyFatChart();
        this.updateCompositionChart();
        this.updateMeasurementsChart();
    }

    updateWeightChart() {
        const ctx = document.getElementById('weight-chart').getContext('2d');
        
        if (this.charts.weight) {
            this.charts.weight.destroy();
        }

        const sortedEntries = [...this.weightEntries].sort((a, b) => new Date(a.date) - new Date(b.date));
        const labels = sortedEntries.map(entry => entry.date);
        const data = sortedEntries.map(entry => entry.bodyWeight);

        this.charts.weight = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Body Weight (lbs)',
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
                        text: 'Weight Progress Over Time'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Weight (lbs)'
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

    updateBodyFatChart() {
        const ctx = document.getElementById('body-fat-chart').getContext('2d');
        
        if (this.charts.bodyFat) {
            this.charts.bodyFat.destroy();
        }

        const sortedEntries = [...this.weightEntries].sort((a, b) => new Date(a.date) - new Date(b.date));
        const labels = sortedEntries.map(entry => entry.date);
        const data = sortedEntries.map(entry => entry.bodyFat).filter(val => val !== null);

        if (data.length === 0) return;

        this.charts.bodyFat = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Body Fat %',
                    data: data,
                    borderColor: '#56ab2f',
                    backgroundColor: 'rgba(86, 171, 47, 0.1)',
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
                        text: 'Body Fat Progress Over Time'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Body Fat %'
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

    updateCompositionChart() {
        const ctx = document.getElementById('composition-chart').getContext('2d');
        
        if (this.charts.composition) {
            this.charts.composition.destroy();
        }

        const sortedEntries = [...this.weightEntries].sort((a, b) => new Date(a.date) - new Date(b.date));
        const labels = sortedEntries.map(entry => entry.date);
        const leanMassData = sortedEntries.map(entry => entry.leanMass).filter(val => val !== null);
        const bodyFatData = sortedEntries.map(entry => entry.bodyFatLbs).filter(val => val !== null);

        if (leanMassData.length === 0 && bodyFatData.length === 0) return;

        this.charts.composition = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Lean Mass (lbs)',
                        data: leanMassData,
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.1,
                        fill: false
                    },
                    {
                        label: 'Body Fat (lbs)',
                        data: bodyFatData,
                        borderColor: '#dc3545',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        tension: 0.1,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Body Composition Over Time'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Weight (lbs)'
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

    updateMeasurementsChart() {
        const ctx = document.getElementById('measurements-chart').getContext('2d');
        
        if (this.charts.measurements) {
            this.charts.measurements.destroy();
        }

        const sortedEntries = [...this.weightEntries].sort((a, b) => new Date(a.date) - new Date(b.date));
        const labels = sortedEntries.map(entry => entry.date);
        const waistData = sortedEntries.map(entry => entry.waist).filter(val => val !== null);
        const chestData = sortedEntries.map(entry => entry.chest).filter(val => val !== null);
        const armsData = sortedEntries.map(entry => entry.arms).filter(val => val !== null);
        const thighsData = sortedEntries.map(entry => entry.thighs).filter(val => val !== null);

        if (waistData.length === 0 && chestData.length === 0 && armsData.length === 0 && thighsData.length === 0) return;

        this.charts.measurements = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Waist (inches)',
                        data: waistData,
                        borderColor: '#ffc107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        tension: 0.1,
                        fill: false
                    },
                    {
                        label: 'Chest (inches)',
                        data: chestData,
                        borderColor: '#17a2b8',
                        backgroundColor: 'rgba(23, 162, 184, 0.1)',
                        tension: 0.1,
                        fill: false
                    },
                    {
                        label: 'Arms (inches)',
                        data: armsData,
                        borderColor: '#6f42c1',
                        backgroundColor: 'rgba(111, 66, 193, 0.1)',
                        tension: 0.1,
                        fill: false
                    },
                    {
                        label: 'Thighs (inches)',
                        data: thighsData,
                        borderColor: '#fd7e14',
                        backgroundColor: 'rgba(253, 126, 20, 0.1)',
                        tension: 0.1,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Body Measurements Over Time'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Inches'
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

    exportToCSV() {
        if (this.weightEntries.length === 0) {
            this.showMessage('No weight entries to export!', 'error');
            return;
        }

        const headers = [
            'Date',
            'Body Weight (lbs)',
            'Body Fat %',
            'Muscle Mass (lbs)',
            'Body Fat (lbs)',
            'Lean Mass (lbs)',
            'BMI',
            'Height (inches)',
            'Waist (inches)',
            'Chest (inches)',
            'Arms (inches)',
            'Thighs (inches)',
            'Calories Consumed',
            'Water Intake (oz)',
            'Sleep Hours',
            'Stress Level',
            'Energy Level',
            'Notes',
            'Timestamp'
        ];

        const csvRows = [headers.join(',')];

        this.weightEntries.forEach(entry => {
            const row = [
                entry.date,
                entry.bodyWeight,
                entry.bodyFat || '',
                entry.muscleMass || '',
                entry.bodyFatLbs || '',
                entry.leanMass || '',
                entry.bmi || '',
                entry.height || '',
                entry.waist || '',
                entry.chest || '',
                entry.arms || '',
                entry.thighs || '',
                entry.caloriesConsumed || '',
                entry.waterIntake || '',
                entry.sleepHours || '',
                entry.stressLevel || '',
                entry.energyLevel || '',
                `"${entry.notes || ''}"`,
                entry.timestamp
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `weight_tracker_${timestamp}.csv`;
        
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showMessage(`Exported ${this.weightEntries.length} weight entries to ${filename}!`, 'success');
    }

    exportToJSON() {
        if (this.weightEntries.length === 0) {
            this.showMessage('No weight entries to export!', 'error');
            return;
        }

        const dataStr = JSON.stringify(this.weightEntries, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const link = document.createElement('a');
        
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `weight_tracker_${timestamp}.json`;
        
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showMessage(`Exported ${this.weightEntries.length} weight entries to ${filename}!`, 'success');
    }

    saveWeightEntriesToStorage() {
        localStorage.setItem('weight_entries', JSON.stringify(this.weightEntries));
    }

    loadWeightEntriesFromStorage() {
        const stored = localStorage.getItem('weight_entries');
        this.weightEntries = stored ? JSON.parse(stored) : [];
        this.filteredEntries = [...this.weightEntries];
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
    window.weightTracker = new WeightTracker();
}); 
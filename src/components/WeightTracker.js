import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faTrash, 
  faDownload, 
  faCode,
  faWeightScale,
  faSearch,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WeightTracker = () => {
  const [weightEntries, setWeightEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    bodyWeight: '',
    bodyFat: '',
    muscleMass: '',
    bodyFatLbs: '',
    leanMass: '',
    bmi: '',
    height: '',
    waist: '',
    chest: '',
    arms: '',
    thighs: '',
    caloriesConsumed: '',
    waterIntake: '',
    sleepHours: '',
    stressLevel: '',
    energyLevel: '',
    notes: ''
  });
  const [message, setMessage] = useState(null);

  const saveWeightEntriesToStorage = useCallback(() => {
    localStorage.setItem('weight_entries', JSON.stringify(weightEntries));
  }, [weightEntries]);

  useEffect(() => {
    loadWeightEntriesFromStorage();
  }, []);

  useEffect(() => {
    saveWeightEntriesToStorage();
    setFilteredEntries([...weightEntries]);
  }, [saveWeightEntriesToStorage, weightEntries]);

  const loadWeightEntriesFromStorage = () => {
    const stored = localStorage.getItem('weight_entries');
    if (stored) {
      setWeightEntries(JSON.parse(stored));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'height' || name === 'bodyWeight') {
      calculateBMI();
    }
    if (name === 'bodyFat' || name === 'bodyWeight') {
      calculateBodyComposition();
    }
  };

  const calculateBMI = () => {
    const weight = parseFloat(formData.bodyWeight) || 0;
    const height = parseFloat(formData.height) || 0;
    
    if (weight > 0 && height > 0) {
      const heightMeters = height * 0.0254;
      const weightKg = weight * 0.453592;
      const bmi = weightKg / (heightMeters * heightMeters);
      
      setFormData(prev => ({
        ...prev,
        bmi: bmi.toFixed(1)
      }));
    }
  };

  const calculateBodyComposition = () => {
    const weight = parseFloat(formData.bodyWeight) || 0;
    const bodyFatPercent = parseFloat(formData.bodyFat) || 0;
    
    if (weight > 0 && bodyFatPercent > 0) {
      const bodyFatLbs = (weight * bodyFatPercent) / 100;
      const leanMass = weight - bodyFatLbs;
      
      setFormData(prev => ({
        ...prev,
        bodyFatLbs: bodyFatLbs.toFixed(1),
        leanMass: leanMass.toFixed(1)
      }));
    }
  };

  const addWeightEntry = () => {
    if (!formData.date) {
      showMessage('Please select a date', 'error');
      return;
    }

    if (!formData.bodyWeight || formData.bodyWeight < 50 || formData.bodyWeight > 500) {
      showMessage('Please enter a valid body weight between 50-500 lbs', 'error');
      return;
    }

    const existingEntry = weightEntries.find(entry => entry.date === formData.date);
    if (existingEntry) {
      if (window.confirm('An entry already exists for this date. Do you want to replace it?')) {
        setWeightEntries(prev => prev.filter(entry => entry.date !== formData.date));
      } else {
        return;
      }
    }

    const entry = {
      id: Date.now(),
      date: formData.date,
      bodyWeight: parseFloat(formData.bodyWeight),
      bodyFat: parseFloat(formData.bodyFat) || null,
      muscleMass: parseFloat(formData.muscleMass) || null,
      bodyFatLbs: parseFloat(formData.bodyFatLbs) || null,
      leanMass: parseFloat(formData.leanMass) || null,
      bmi: parseFloat(formData.bmi) || null,
      height: parseFloat(formData.height) || null,
      waist: parseFloat(formData.waist) || null,
      chest: parseFloat(formData.chest) || null,
      arms: parseFloat(formData.arms) || null,
      thighs: parseFloat(formData.thighs) || null,
      caloriesConsumed: parseInt(formData.caloriesConsumed) || null,
      waterIntake: parseInt(formData.waterIntake) || null,
      sleepHours: parseFloat(formData.sleepHours) || null,
      stressLevel: parseInt(formData.stressLevel) || null,
      energyLevel: parseInt(formData.energyLevel) || null,
      notes: formData.notes.trim(),
      timestamp: new Date().toISOString()
    };

    setWeightEntries(prev => [...prev, entry]);
    clearForm();
    showMessage('Weight entry added successfully!', 'success');
  };

  const clearForm = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      bodyWeight: '',
      bodyFat: '',
      muscleMass: '',
      bodyFatLbs: '',
      leanMass: '',
      bmi: '',
      height: '',
      waist: '',
      chest: '',
      arms: '',
      thighs: '',
      caloriesConsumed: '',
      waterIntake: '',
      sleepHours: '',
      stressLevel: '',
      energyLevel: '',
      notes: ''
    });
  };

  const deleteWeightEntry = (id) => {
    setWeightEntries(prev => prev.filter(entry => entry.id !== id));
    showMessage('Weight entry removed successfully!', 'success');
  };

  const filterWeightEntries = () => {
    const searchTerm = document.getElementById('search-weight').value.toLowerCase();
    const timeRange = document.getElementById('filter-time-range').value;
    
    const filtered = weightEntries.filter(entry => {
      const matchesSearch = !searchTerm || 
        entry.notes.toLowerCase().includes(searchTerm) ||
        entry.date.includes(searchTerm);
      
      let matchesTime = true;
      if (timeRange !== 'all') {
        const entryDate = new Date(entry.date);
        const daysAgo = (Date.now() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
        matchesTime = daysAgo <= parseInt(timeRange);
      }
      
      return matchesSearch && matchesTime;
    });

    setFilteredEntries(filtered);
  };

  const clearWeightFilters = () => {
    document.getElementById('search-weight').value = '';
    document.getElementById('filter-time-range').value = 'all';
    setFilteredEntries([...weightEntries]);
  };

  const exportToCSV = () => {
    if (weightEntries.length === 0) {
      showMessage('No weight entries to export!', 'error');
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

    weightEntries.forEach(entry => {
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
    
    const timestamp = format(new Date(), 'yyyy-MM-dd');
    const filename = `weight_tracker_${timestamp}.csv`;
    
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showMessage(`Exported ${weightEntries.length} weight entries to ${filename}!`, 'success');
  };

  const exportToJSON = () => {
    if (weightEntries.length === 0) {
      showMessage('No weight entries to export!', 'error');
      return;
    }

    const dataStr = JSON.stringify(weightEntries, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    
    const timestamp = format(new Date(), 'yyyy-MM-dd');
    const filename = `weight_tracker_${timestamp}.json`;
    
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showMessage(`Exported ${weightEntries.length} weight entries to ${filename}!`, 'success');
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const calculateSummary = () => {
    if (weightEntries.length === 0) return null;

    const sortedEntries = [...weightEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
    const currentEntry = sortedEntries[0];
    const startingEntry = sortedEntries[sortedEntries.length - 1];
    
    const totalChange = currentEntry.bodyWeight - startingEntry.bodyWeight;
    const changeText = totalChange > 0 ? `+${totalChange.toFixed(1)} lbs` : `${totalChange.toFixed(1)} lbs`;
    
    const firstDate = new Date(startingEntry.date);
    const lastDate = new Date(currentEntry.date);
    const daysTracked = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)) + 1;
    
    return {
      currentWeight: currentEntry.bodyWeight,
      startingWeight: startingEntry.bodyWeight,
      totalChange: changeText,
      currentBodyFat: currentEntry.bodyFat,
      totalEntries: weightEntries.length,
      daysTracked
    };
  };

  const summary = calculateSummary();

  const chartData = {
    weight: {
      labels: weightEntries.sort((a, b) => new Date(a.date) - new Date(b.date)).map(entry => entry.date),
      datasets: [{
        label: 'Body Weight (lbs)',
        data: weightEntries.sort((a, b) => new Date(a.date) - new Date(b.date)).map(entry => entry.bodyWeight),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.1,
        fill: true
      }]
    },
    bodyFat: {
      labels: weightEntries.sort((a, b) => new Date(a.date) - new Date(b.date)).map(entry => entry.date),
      datasets: [{
        label: 'Body Fat %',
        data: weightEntries.sort((a, b) => new Date(a.date) - new Date(b.date)).map(entry => entry.bodyFat).filter(val => val !== null),
        borderColor: '#56ab2f',
        backgroundColor: 'rgba(86, 171, 47, 0.1)',
        tension: 0.1,
        fill: true
      }]
    },
    composition: {
      labels: weightEntries.sort((a, b) => new Date(a.date) - new Date(b.date)).map(entry => entry.date),
      datasets: [
        {
          label: 'Lean Mass (lbs)',
          data: weightEntries.sort((a, b) => new Date(a.date) - new Date(b.date)).map(entry => entry.leanMass).filter(val => val !== null),
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.1,
          fill: false
        },
        {
          label: 'Body Fat (lbs)',
          data: weightEntries.sort((a, b) => new Date(a.date) - new Date(b.date)).map(entry => entry.bodyFatLbs).filter(val => val !== null),
          borderColor: '#dc3545',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          tension: 0.1,
          fill: false
        }
      ]
    },
    measurements: {
      labels: weightEntries.sort((a, b) => new Date(a.date) - new Date(b.date)).map(entry => entry.date),
      datasets: [
        {
          label: 'Waist (inches)',
          data: weightEntries.sort((a, b) => new Date(a.date) - new Date(b.date)).map(entry => entry.waist).filter(val => val !== null),
          borderColor: '#ffc107',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          tension: 0.1,
          fill: false
        },
        {
          label: 'Chest (inches)',
          data: weightEntries.sort((a, b) => new Date(a.date) - new Date(b.date)).map(entry => entry.chest).filter(val => val !== null),
          borderColor: '#17a2b8',
          backgroundColor: 'rgba(23, 162, 184, 0.1)',
          tension: 0.1,
          fill: false
        },
        {
          label: 'Arms (inches)',
          data: weightEntries.sort((a, b) => new Date(a.date) - new Date(b.date)).map(entry => entry.arms).filter(val => val !== null),
          borderColor: '#6f42c1',
          backgroundColor: 'rgba(111, 66, 193, 0.1)',
          tension: 0.1,
          fill: false
        },
        {
          label: 'Thighs (inches)',
          data: weightEntries.sort((a, b) => new Date(a.date) - new Date(b.date)).map(entry => entry.thighs).filter(val => val !== null),
          borderColor: '#fd7e14',
          backgroundColor: 'rgba(253, 126, 20, 0.1)',
          tension: 0.1,
          fill: false
        }
      ]
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Progress Over Time'
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
    <div className="container">
      <div className="card">
        <h2>Add New Weight Entry</h2>
        
        <div className="weight-form-grid">
          <div className="form-group">
            <label htmlFor="weight-date">Date *</label>
            <input
              type="date"
              id="weight-date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="body-weight">Body Weight (lbs) *</label>
            <input
              type="number"
              id="body-weight"
              name="bodyWeight"
              value={formData.bodyWeight}
              onChange={handleInputChange}
              min="50"
              max="500"
              step="0.1"
              placeholder="180.5"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="body-fat">Body Fat %</label>
            <input
              type="number"
              id="body-fat"
              name="bodyFat"
              value={formData.bodyFat}
              onChange={handleInputChange}
              min="3"
              max="50"
              step="0.1"
              placeholder="15.2"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="muscle-mass">Muscle Mass (lbs)</label>
            <input
              type="number"
              id="muscle-mass"
              name="muscleMass"
              value={formData.muscleMass}
              onChange={handleInputChange}
              min="20"
              max="300"
              step="0.1"
              placeholder="120.0"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="body-fat-lbs">Body Fat (lbs)</label>
            <input
              type="number"
              id="body-fat-lbs"
              name="bodyFatLbs"
              value={formData.bodyFatLbs}
              onChange={handleInputChange}
              min="1"
              max="200"
              step="0.1"
              placeholder="27.4"
              readOnly
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lean-mass">Lean Mass (lbs)</label>
            <input
              type="number"
              id="lean-mass"
              name="leanMass"
              value={formData.leanMass}
              onChange={handleInputChange}
              min="20"
              max="300"
              step="0.1"
              placeholder="153.1"
              readOnly
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="bmi">BMI</label>
            <input
              type="number"
              id="bmi"
              name="bmi"
              value={formData.bmi}
              min="10"
              max="60"
              step="0.1"
              placeholder="24.8"
              readOnly
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="height">Height (inches)</label>
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              min="48"
              max="96"
              step="0.5"
              placeholder="70"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="waist">Waist (inches)</label>
            <input
              type="number"
              id="waist"
              name="waist"
              value={formData.waist}
              onChange={handleInputChange}
              min="20"
              max="80"
              step="0.1"
              placeholder="32.5"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="chest">Chest (inches)</label>
            <input
              type="number"
              id="chest"
              name="chest"
              value={formData.chest}
              onChange={handleInputChange}
              min="20"
              max="80"
              step="0.1"
              placeholder="42.0"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="arms">Arms (inches)</label>
            <input
              type="number"
              id="arms"
              name="arms"
              value={formData.arms}
              onChange={handleInputChange}
              min="8"
              max="30"
              step="0.1"
              placeholder="14.5"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="thighs">Thighs (inches)</label>
            <input
              type="number"
              id="thighs"
              name="thighs"
              value={formData.thighs}
              onChange={handleInputChange}
              min="15"
              max="40"
              step="0.1"
              placeholder="24.0"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="calories-consumed">Calories Consumed</label>
            <input
              type="number"
              id="calories-consumed"
              name="caloriesConsumed"
              value={formData.caloriesConsumed}
              onChange={handleInputChange}
              min="0"
              max="10000"
              step="50"
              placeholder="2200"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="water-intake">Water Intake (oz)</label>
            <input
              type="number"
              id="water-intake"
              name="waterIntake"
              value={formData.waterIntake}
              onChange={handleInputChange}
              min="0"
              max="200"
              step="1"
              placeholder="80"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="sleep-hours">Sleep Hours</label>
            <input
              type="number"
              id="sleep-hours"
              name="sleepHours"
              value={formData.sleepHours}
              onChange={handleInputChange}
              min="0"
              max="24"
              step="0.5"
              placeholder="7.5"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="stress-level">Stress Level (1-10)</label>
            <select
              id="stress-level"
              name="stressLevel"
              value={formData.stressLevel}
              onChange={handleInputChange}
            >
              <option value="">Select Level</option>
              <option value="1">1 - Very Low</option>
              <option value="2">2 - Low</option>
              <option value="3">3 - Mild</option>
              <option value="4">4 - Moderate</option>
              <option value="5">5 - Medium</option>
              <option value="6">6 - Elevated</option>
              <option value="7">7 - High</option>
              <option value="8">8 - Very High</option>
              <option value="9">9 - Extreme</option>
              <option value="10">10 - Critical</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="energy-level">Energy Level (1-10)</label>
            <select
              id="energy-level"
              name="energyLevel"
              value={formData.energyLevel}
              onChange={handleInputChange}
            >
              <option value="">Select Level</option>
              <option value="1">1 - Exhausted</option>
              <option value="2">2 - Very Tired</option>
              <option value="3">3 - Tired</option>
              <option value="4">4 - Low</option>
              <option value="5">5 - Moderate</option>
              <option value="6">6 - Good</option>
              <option value="7">7 - High</option>
              <option value="8">8 - Very High</option>
              <option value="9">9 - Excellent</option>
              <option value="10">10 - Amazing</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="How are you feeling? Any changes in diet or routine?"
            />
          </div>
        </div>

        <div className="weight-form-actions">
          <button type="button" onClick={addWeightEntry} className="btn btn-primary">
            <FontAwesomeIcon icon={faPlus} /> Add Weight Entry
          </button>
          <button type="button" onClick={clearForm} className="btn btn-secondary">
            <FontAwesomeIcon icon={faTimes} /> Clear Form
          </button>
        </div>
      </div>

      {summary && (
        <div className="card">
          <h2>Weight Summary</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Current Weight</span>
              <span className="summary-value">{summary.currentWeight} lbs</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Starting Weight</span>
              <span className="summary-value">{summary.startingWeight} lbs</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Change</span>
              <span className="summary-value">{summary.totalChange}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Current Body Fat</span>
              <span className="summary-value">{summary.currentBodyFat ? `${summary.currentBodyFat}%` : 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Entries</span>
              <span className="summary-value">{summary.totalEntries}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Days Tracked</span>
              <span className="summary-value">{summary.daysTracked}</span>
            </div>
          </div>
        </div>
      )}

      {weightEntries.length > 0 && (
        <>
          <div className="card">
            <h2>Progress Charts</h2>
            <div className="charts-grid">
              <div className="chart-container">
                <h3>Weight Progress</h3>
                <div className="chart-wrapper">
                  <Line data={chartData.weight} options={chartOptions} />
                </div>
              </div>
              
              {chartData.bodyFat.datasets[0].data.length > 0 && (
                <div className="chart-container">
                  <h3>Body Fat Progress</h3>
                  <div className="chart-wrapper">
                    <Line data={chartData.bodyFat} options={chartOptions} />
                  </div>
                </div>
              )}
              
              {(chartData.composition.datasets[0].data.length > 0 || chartData.composition.datasets[1].data.length > 0) && (
                <div className="chart-container">
                  <h3>Body Composition</h3>
                  <div className="chart-wrapper">
                    <Line data={chartData.composition} options={chartOptions} />
                  </div>
                </div>
              )}
              
              {(chartData.measurements.datasets[0].data.length > 0 || chartData.measurements.datasets[1].data.length > 0 || 
                chartData.measurements.datasets[2].data.length > 0 || chartData.measurements.datasets[3].data.length > 0) && (
                <div className="chart-container">
                  <h3>Measurements</h3>
                  <div className="chart-wrapper">
                    <Line data={chartData.measurements} options={chartOptions} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h2>Weight History</h2>
            <div className="history-controls">
              <div className="search-box">
                <input
                  type="text"
                  id="search-weight"
                  placeholder="Search notes..."
                  onChange={filterWeightEntries}
                />
                <FontAwesomeIcon icon={faSearch} />
              </div>
              
              <div className="filter-controls">
                <select id="filter-time-range" onChange={filterWeightEntries}>
                  <option value="all">All Time</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="180">Last 6 Months</option>
                  <option value="365">Last Year</option>
                </select>
                
                <button type="button" onClick={clearWeightFilters} className="btn btn-secondary">
                  <FontAwesomeIcon icon={faTimes} /> Clear Filters
                </button>
              </div>
            </div>

            <div id="weight-entries-container">
              {filteredEntries.length === 0 ? (
                <div className="no-entries">
                  <FontAwesomeIcon icon={faWeightScale} />
                  <p>No weight entries found matching your filters.</p>
                </div>
              ) : (
                filteredEntries
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map(entry => (
                    <div key={entry.id} className="weight-entry-item">
                      <div className="weight-entry-header">
                        <div className="weight-entry-date">
                          <h3>{format(new Date(entry.date), 'MMM dd, yyyy')}</h3>
                          <span className="weight-value">{entry.bodyWeight} lbs</span>
                        </div>
                        <div className="weight-entry-actions">
                          <button
                            className="delete-weight-entry"
                            onClick={() => deleteWeightEntry(entry.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="weight-entry-details">
                        <div className="detail-row">
                          <div className="detail-item">
                            <span className="detail-label">Body Fat</span>
                            <span className="detail-value">{entry.bodyFat ? `${entry.bodyFat}%` : 'N/A'}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">BMI</span>
                            <span className="detail-value">{entry.bmi ? entry.bmi.toFixed(1) : 'N/A'}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Muscle Mass</span>
                            <span className="detail-value">{entry.muscleMass ? `${entry.muscleMass} lbs` : 'N/A'}</span>
                          </div>
                        </div>
                        
                        {(entry.waist || entry.chest || entry.arms || entry.thighs) && (
                          <div className="measurements-row">
                            <span className="measurements-label">Measurements:</span>
                            <span className="measurements-value">
                              {[
                                entry.waist && `Waist: ${entry.waist}"`,
                                entry.chest && `Chest: ${entry.chest}"`,
                                entry.arms && `Arms: ${entry.arms}"`,
                                entry.thighs && `Thighs: ${entry.thighs}"`
                              ].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                        
                        {entry.notes && (
                          <div className="weight-entry-notes">
                            <FontAwesomeIcon icon={faWeightScale} />
                            {entry.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="card">
            <h3>Export Your Data</h3>
            <div className="export-buttons">
              <button type="button" onClick={exportToCSV} className="btn btn-success">
                <FontAwesomeIcon icon={faDownload} /> Export to CSV
              </button>
              <button type="button" onClick={exportToJSON} className="btn btn-primary">
                <FontAwesomeIcon icon={faCode} /> Export to JSON
              </button>
            </div>
          </div>
        </>
      )}

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default WeightTracker;

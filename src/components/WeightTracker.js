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
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
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
import { format } from 'date-fns';

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
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom color="primary">
            Add New Weight Entry
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Body Weight (lbs)"
                name="bodyWeight"
                value={formData.bodyWeight}
                onChange={handleInputChange}
                inputProps={{ min: 50, max: 500, step: 0.1 }}
                placeholder="180.5"
                required
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Body Fat %"
                name="bodyFat"
                value={formData.bodyFat}
                onChange={handleInputChange}
                inputProps={{ min: 3, max: 50, step: 0.1 }}
                placeholder="15.2"
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Muscle Mass (lbs)"
                name="muscleMass"
                value={formData.muscleMass}
                onChange={handleInputChange}
                inputProps={{ min: 20, max: 300, step: 0.1 }}
                placeholder="120.0"
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Body Fat (lbs)"
                name="bodyFatLbs"
                value={formData.bodyFatLbs}
                inputProps={{ min: 1, max: 200, step: 0.1, readOnly: true }}
                placeholder="27.4"
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Lean Mass (lbs)"
                name="leanMass"
                value={formData.leanMass}
                inputProps={{ min: 20, max: 300, step: 0.1, readOnly: true }}
                placeholder="153.1"
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="BMI"
                name="bmi"
                value={formData.bmi}
                inputProps={{ min: 10, max: 60, step: 0.1, readOnly: true }}
                placeholder="24.8"
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Height (inches)"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                inputProps={{ min: 48, max: 96, step: 0.5 }}
                placeholder="70"
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Waist (inches)"
                name="waist"
                value={formData.waist}
                onChange={handleInputChange}
                inputProps={{ min: 20, max: 80, step: 0.1 }}
                placeholder="32.5"
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Chest (inches)"
                name="chest"
                value={formData.chest}
                onChange={handleInputChange}
                inputProps={{ min: 20, max: 80, step: 0.1 }}
                placeholder="42.0"
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Arms (inches)"
                name="arms"
                value={formData.arms}
                onChange={handleInputChange}
                inputProps={{ min: 8, max: 30, step: 0.1 }}
                placeholder="14.5"
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Thighs (inches)"
                name="thighs"
                value={formData.thighs}
                onChange={handleInputChange}
                inputProps={{ min: 15, max: 40, step: 0.1 }}
                placeholder="24.0"
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Calories Consumed"
                name="caloriesConsumed"
                value={formData.caloriesConsumed}
                onChange={handleInputChange}
                inputProps={{ min: 0, max: 10000, step: 50 }}
                placeholder="2200"
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Water Intake (oz)"
                name="waterIntake"
                value={formData.waterIntake}
                onChange={handleInputChange}
                inputProps={{ min: 0, max: 200, step: 1 }}
                placeholder="80"
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Sleep Hours"
                name="sleepHours"
                value={formData.sleepHours}
                onChange={handleInputChange}
                inputProps={{ min: 0, max: 24, step: 0.5 }}
                placeholder="7.5"
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Stress Level (1-10)</InputLabel>
                <Select
                  name="stressLevel"
                  value={formData.stressLevel}
                  onChange={handleInputChange}
                  label="Stress Level (1-10)"
                >
                  <MenuItem value="">Select Level</MenuItem>
                  <MenuItem value="1">1 - Very Low</MenuItem>
                  <MenuItem value="2">2 - Low</MenuItem>
                  <MenuItem value="3">3 - Mild</MenuItem>
                  <MenuItem value="4">4 - Moderate</MenuItem>
                  <MenuItem value="5">5 - Medium</MenuItem>
                  <MenuItem value="6">6 - Elevated</MenuItem>
                  <MenuItem value="7">7 - High</MenuItem>
                  <MenuItem value="8">8 - Very High</MenuItem>
                  <MenuItem value="9">9 - Extreme</MenuItem>
                  <MenuItem value="10">10 - Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Energy Level (1-10)</InputLabel>
                <Select
                  name="energyLevel"
                  value={formData.energyLevel}
                  onChange={handleInputChange}
                  label="Energy Level (1-10)"
                >
                  <MenuItem value="">Select Level</MenuItem>
                  <MenuItem value="1">1 - Exhausted</MenuItem>
                  <MenuItem value="2">2 - Very Tired</MenuItem>
                  <MenuItem value="3">3 - Tired</MenuItem>
                  <MenuItem value="4">4 - Low</MenuItem>
                  <MenuItem value="5">5 - Moderate</MenuItem>
                  <MenuItem value="6">6 - Good</MenuItem>
                  <MenuItem value="7">7 - High</MenuItem>
                  <MenuItem value="8">8 - Very High</MenuItem>
                  <MenuItem value="9">9 - Excellent</MenuItem>
                  <MenuItem value="10">10 - Amazing</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="How are you feeling? Any changes in diet or routine?"
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={addWeightEntry}
              startIcon={<AddIcon />}
              size="large"
            >
              Add Weight Entry
            </Button>
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={clearForm}
              startIcon={<ClearIcon />}
              size="large"
            >
              Clear Form
            </Button>
          </Box>
        </CardContent>
      </Card>

      {summary && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom color="primary">
              Weight Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Current Weight
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {summary.currentWeight} lbs
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Starting Weight
                  </Typography>
                  <Typography variant="h6">
                    {summary.startingWeight} lbs
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Change
                  </Typography>
                  <Typography variant="h6" color={summary.totalChange.includes('+') ? 'error' : 'success'}>
                    {summary.totalChange}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Current Body Fat
                  </Typography>
                  <Typography variant="h6">
                    {summary.currentBodyFat ? `${summary.currentBodyFat}%` : 'N/A'}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Entries
                  </Typography>
                  <Typography variant="h6">
                    {summary.totalEntries}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Days Tracked
                  </Typography>
                  <Typography variant="h6">
                    {summary.daysTracked}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {weightEntries.length > 0 && (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h4" gutterBottom color="primary">
                Progress Charts
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Weight Progress
                    </Typography>
                    <Box sx={{ height: 400 }}>
                      <Line data={chartData.weight} options={chartOptions} />
                    </Box>
                  </Card>
                </Grid>
                
                {chartData.bodyFat.datasets[0].data.length > 0 && (
                  <Grid item xs={12} lg={6}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Body Fat Progress
                      </Typography>
                      <Box sx={{ height: 400 }}>
                        <Line data={chartData.bodyFat} options={chartOptions} />
                      </Box>
                    </Card>
                  </Grid>
                )}
                
                {(chartData.composition.datasets[0].data.length > 0 || chartData.composition.datasets[1].data.length > 0) && (
                  <Grid item xs={12} lg={6}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Body Composition
                      </Typography>
                      <Box sx={{ height: 400 }}>
                        <Line data={chartData.composition} options={chartOptions} />
                      </Box>
                    </Card>
                  </Grid>
                )}
                
                {(chartData.measurements.datasets[0].data.length > 0 || chartData.measurements.datasets[1].data.length > 0 || 
                  chartData.measurements.datasets[2].data.length > 0 || chartData.measurements.datasets[3].data.length > 0) && (
                  <Grid item xs={12} lg={6}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Measurements
                      </Typography>
                      <Box sx={{ height: 400 }}>
                        <Line data={chartData.measurements} options={chartOptions} />
                      </Box>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h4" gutterBottom color="primary">
                Weight History
              </Typography>
              <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Search notes..."
                  onChange={filterWeightEntries}
                  InputProps={{
                    startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                  }}
                  sx={{ minWidth: 200 }}
                />
                
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Time Range</InputLabel>
                  <Select
                    defaultValue="all"
                    onChange={filterWeightEntries}
                    label="Time Range"
                  >
                    <MenuItem value="all">All Time</MenuItem>
                    <MenuItem value="30">Last 30 Days</MenuItem>
                    <MenuItem value="90">Last 90 Days</MenuItem>
                    <MenuItem value="180">Last 6 Months</MenuItem>
                    <MenuItem value="365">Last Year</MenuItem>
                  </Select>
                </FormControl>
                
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={clearWeightFilters}
                  startIcon={<ClearIcon />}
                  size="small"
                >
                  Clear Filters
                </Button>
              </Box>

              {filteredEntries.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <FilterListIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No weight entries found matching your filters.
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {filteredEntries
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map(entry => (
                      <Grid item xs={12} key={entry.id}>
                        <Card variant="outlined" sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box>
                              <Typography variant="h6">
                                {format(new Date(entry.date), 'MMM dd, yyyy')}
                              </Typography>
                              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                                {entry.bodyWeight} lbs
                              </Typography>
                            </Box>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => deleteWeightEntry(entry.id)}
                              startIcon={<DeleteIcon />}
                            >
                              Delete
                            </Button>
                          </Box>
                          
                          <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={6} sm={3}>
                              <Typography variant="body2" color="text.secondary">Body Fat</Typography>
                              <Typography variant="body1">{entry.bodyFat ? `${entry.bodyFat}%` : 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                              <Typography variant="body2" color="text.secondary">BMI</Typography>
                              <Typography variant="body1">{entry.bmi ? entry.bmi.toFixed(1) : 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                              <Typography variant="body2" color="text.secondary">Muscle Mass</Typography>
                              <Typography variant="body1">{entry.muscleMass ? `${entry.muscleMass} lbs` : 'N/A'}</Typography>
                            </Grid>
                          </Grid>
                          
                          {(entry.waist || entry.chest || entry.arms || entry.thighs) && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              <strong>Measurements:</strong> {[
                                entry.waist && `Waist: ${entry.waist}"`,
                                entry.chest && `Chest: ${entry.chest}"`,
                                entry.arms && `Arms: ${entry.arms}"`,
                                entry.thighs && `Thighs: ${entry.thighs}"`
                              ].filter(Boolean).join(', ')}
                            </Typography>
                          )}
                          
                          {entry.notes && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                              <FilterListIcon fontSize="small" color="primary" />
                              <Typography variant="body2">{entry.notes}</Typography>
                            </Box>
                          )}
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom color="primary">
                Export Your Data
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  color="success" 
                  onClick={exportToCSV}
                  startIcon={<DownloadIcon />}
                >
                  Export to CSV
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={exportToJSON}
                  startIcon={<DownloadIcon />}
                >
                  Export to JSON
                </Button>
              </Box>
            </CardContent>
          </Card>
        </>
      )}

      {message && (
        <Alert severity={message.type} sx={{ mt: 2 }}>
          {message.text}
        </Alert>
      )}
    </Box>
  );
};

export default WeightTracker;

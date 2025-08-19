import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faDumbbell, 
  faArrowTrendUp, 
  faArrowTrendDown,
  faFire,
  faWeightHanging,
  faRepeat,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';
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

const LiftMetrics = () => {
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [exerciseData, setExerciseData] = useState([]);
  const [performanceSummary, setPerformanceSummary] = useState(null);
  const [insights, setInsights] = useState([]);

  const analyzeExercise = useCallback(() => {
    if (!selectedExercise) return;

    const exerciseWorkouts = allWorkouts.filter(workout =>
      workout.exercises.some(exercise => exercise.name === selectedExercise)
    );

    const data = exerciseWorkouts.map(workout => {
      const exercise = workout.exercises.find(ex => ex.name === selectedExercise);
      const maxWeight = Math.max(...exercise.sets.map(set => set.weight));
      const totalVolume = exercise.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
      const avgReps = exercise.sets.reduce((sum, set) => sum + set.reps, 0) / exercise.sets.length;
      
      return {
        date: workout.date,
        maxWeight,
        totalVolume,
        avgReps,
        sets: exercise.sets.length,
        notes: exercise.notes
      };
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    setExerciseData(data);
    calculatePerformanceSummary(data);
    generateInsights(data);
  }, [selectedExercise, allWorkouts]);

  useEffect(() => {
    loadSampleData();
  }, []);

  useEffect(() => {
    analyzeExercise();
  }, [analyzeExercise]);

  const loadSampleData = () => {
    // Sample workout data for demonstration
    const sampleWorkouts = [
      {
        id: 1,
        date: '2024-01-15',
        exercises: [
          {
            name: 'Bench Press',
            type: 'strength',
            sets: [
              { weight: 185, reps: 8 },
              { weight: 185, reps: 8 },
              { weight: 185, reps: 7 }
            ],
            notes: 'Felt strong today'
          }
        ]
      },
      {
        id: 2,
        date: '2024-01-10',
        exercises: [
          {
            name: 'Bench Press',
            type: 'strength',
            sets: [
              { weight: 180, reps: 8 },
              { weight: 180, reps: 8 },
              { weight: 180, reps: 8 }
            ],
            notes: 'Good form'
          }
        ]
      },
      {
        id: 3,
        date: '2024-01-05',
        exercises: [
          {
            name: 'Bench Press',
            type: 'strength',
            sets: [
              { weight: 175, reps: 8 },
              { weight: 175, reps: 8 },
              { weight: 175, reps: 7 }
            ],
            notes: 'Starting to feel stronger'
          }
        ]
      },
      {
        id: 4,
        date: '2023-12-30',
        exercises: [
          {
            name: 'Bench Press',
            type: 'strength',
            sets: [
              { weight: 170, reps: 8 },
              { weight: 170, reps: 8 },
              { weight: 170, reps: 8 }
            ],
            notes: 'Consistent reps'
          }
        ]
      },
      {
        id: 5,
        date: '2023-12-25',
        exercises: [
          {
            name: 'Bench Press',
            type: 'strength',
            sets: [
              { weight: 165, reps: 8 },
              { weight: 165, reps: 8 },
              { weight: 165, reps: 7 }
            ],
            notes: 'Holiday workout'
          }
        ]
      }
    ];

    setAllWorkouts(sampleWorkouts);
  };

  const calculatePerformanceSummary = (data) => {
    if (data.length < 2) return;

    const firstWorkout = data[0];
    const lastWorkout = data[data.length - 1];
    
    const weightChange = lastWorkout.maxWeight - firstWorkout.maxWeight;
    const volumeChange = lastWorkout.totalVolume - firstWorkout.totalVolume;
    const repsChange = lastWorkout.avgReps - firstWorkout.avgReps;
    
    const weightTrend = weightChange > 0 ? 'increasing' : weightChange < 0 ? 'decreasing' : 'stable';
    const volumeTrend = volumeChange > 0 ? 'increasing' : volumeChange < 0 ? 'decreasing' : 'stable';
    const repsTrend = repsChange > 0 ? 'increasing' : repsChange < 0 ? 'decreasing' : 'stable';

    setPerformanceSummary({
      weightChange: weightChange > 0 ? `+${weightChange}` : weightChange.toString(),
      volumeChange: volumeChange > 0 ? `+${volumeChange}` : volumeChange.toString(),
      repsChange: repsChange > 0 ? `+${repsChange.toFixed(1)}` : repsChange.toFixed(1),
      weightTrend,
      volumeTrend,
      repsTrend,
      totalWorkouts: data.length,
      dateRange: `${firstWorkout.date} to ${lastWorkout.date}`
    });
  };

  const generateInsights = (data) => {
    if (data.length < 2) return;

    const insights = [];
    
    // Weight progression insight
    const weightProgress = data[data.length - 1].maxWeight - data[0].maxWeight;
    if (weightProgress > 0) {
      insights.push({
        type: 'positive',
        icon: faArrowTrendUp,
        text: `You've increased your max weight by ${weightProgress} lbs!`
      });
    } else if (weightProgress < 0) {
      insights.push({
        type: 'warning',
        icon: faArrowTrendDown,
        text: `Your max weight has decreased by ${Math.abs(weightProgress)} lbs. Consider deloading or checking form.`
      });
    }

    // Consistency insight
    const consistentWorkouts = data.filter(workout => workout.sets >= 3).length;
    const consistencyRate = (consistentWorkouts / data.length) * 100;
    if (consistencyRate >= 80) {
      insights.push({
        type: 'positive',
        icon: faFire,
        text: `Great consistency! You're hitting ${consistencyRate.toFixed(0)}% of your target sets.`
      });
    } else {
      insights.push({
        type: 'info',
        icon: faDumbbell,
        text: `Consider aiming for more consistent set completion (currently ${consistencyRate.toFixed(0)}%).`
      });
    }

    // Volume insight
    const avgVolume = data.reduce((sum, workout) => sum + workout.totalVolume, 0) / data.length;
    const lastVolume = data[data.length - 1].totalVolume;
    if (lastVolume > avgVolume) {
      insights.push({
        type: 'positive',
        icon: faWeightHanging,
        text: `Your latest workout volume (${lastVolume} lbs) is above your average (${avgVolume.toFixed(0)} lbs).`
      });
    }

    setInsights(insights);
  };

  const getUniqueExercises = () => {
    const exercises = new Set();
    allWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (exercise.type === 'strength') {
          exercises.add(exercise.name);
        }
      });
    });
    return Array.from(exercises).sort();
  };

  const chartData = {
    maxWeight: {
      labels: exerciseData.map(entry => entry.date),
      datasets: [{
        label: 'Max Weight (lbs)',
        data: exerciseData.map(entry => entry.maxWeight),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.1,
        fill: true
      }]
    },
    volume: {
      labels: exerciseData.map(entry => entry.date),
      datasets: [{
        label: 'Total Volume (lbs)',
        data: exerciseData.map(entry => entry.totalVolume),
        borderColor: '#56ab2f',
        backgroundColor: 'rgba(86, 171, 47, 0.1)',
        tension: 0.1,
        fill: true
      }]
    },
    reps: {
      labels: exerciseData.map(entry => entry.date),
      datasets: [{
        label: 'Average Reps',
        data: exerciseData.map(entry => entry.avgReps),
        borderColor: '#ffc107',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        tension: 0.1,
        fill: true
      }]
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Performance Over Time'
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
        <h2>Lift Metrics Analysis</h2>
        
        <div className="exercise-selector">
          <label htmlFor="exercise-select">Select Exercise to Analyze:</label>
          <select
            id="exercise-select"
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
          >
            <option value="">Choose an exercise...</option>
            {getUniqueExercises().map(exercise => (
              <option key={exercise} value={exercise}>{exercise}</option>
            ))}
          </select>
        </div>

        {selectedExercise && exerciseData.length > 0 && (
          <>
            <div className="card">
              <h3>Performance Summary</h3>
              {performanceSummary && (
                <div className="performance-summary">
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">Weight Change</span>
                      <span className={`summary-value ${performanceSummary.weightTrend}`}>
                        {performanceSummary.weightChange} lbs
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Volume Change</span>
                      <span className={`summary-value ${performanceSummary.volumeTrend}`}>
                        {performanceSummary.volumeChange} lbs
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Reps Change</span>
                      <span className={`summary-value ${performanceSummary.repsTrend}`}>
                        {performanceSummary.repsChange}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Total Workouts</span>
                      <span className="summary-value">{performanceSummary.totalWorkouts}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Date Range</span>
                      <span className="summary-value">{performanceSummary.dateRange}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="card">
              <h3>Performance Insights</h3>
              <div className="insights-list">
                {insights.map((insight, index) => (
                  <div key={index} className={`insight-item ${insight.type}`}>
                    <FontAwesomeIcon icon={insight.icon} />
                    <span>{insight.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Progress Charts</h3>
              <div className="charts-grid">
                <div className="chart-container">
                  <h4>Max Weight Progress</h4>
                  <div className="chart-wrapper">
                    <Line data={chartData.maxWeight} options={chartOptions} />
                  </div>
                </div>
                
                <div className="chart-container">
                  <h4>Volume Progress</h4>
                  <div className="chart-wrapper">
                    <Line data={chartData.volume} options={chartOptions} />
                  </div>
                </div>
                
                <div className="chart-container">
                  <h4>Reps Progress</h4>
                  <div className="chart-wrapper">
                    <Line data={chartData.reps} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Workout Details</h3>
              <div className="workout-details">
                {exerciseData.map((entry, index) => (
                  <div key={index} className="workout-detail-item">
                    <div className="workout-detail-header">
                      <h4>{entry.date}</h4>
                      <div className="workout-stats">
                        <span className="stat-badge">
                          <FontAwesomeIcon icon={faWeightHanging} />
                          Max: {entry.maxWeight} lbs
                        </span>
                        <span className="stat-badge">
                          <FontAwesomeIcon icon={faFire} />
                          Volume: {entry.totalVolume} lbs
                        </span>
                        <span className="stat-badge">
                          <FontAwesomeIcon icon={faRepeat} />
                          Avg Reps: {entry.avgReps.toFixed(1)}
                        </span>
                        <span className="stat-badge">
                          <FontAwesomeIcon icon={faDumbbell} />
                          Sets: {entry.sets}
                        </span>
                      </div>
                    </div>
                    {entry.notes && (
                      <div className="workout-notes">
                        <FontAwesomeIcon icon={faCalendar} />
                        {entry.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {selectedExercise && exerciseData.length === 0 && (
          <div className="card">
            <div className="no-data">
              <FontAwesomeIcon icon={faChartLine} />
              <p>No data available for {selectedExercise}. Try selecting a different exercise or add more workouts.</p>
            </div>
          </div>
        )}

        {!selectedExercise && (
          <div className="card">
            <div className="select-prompt">
              <FontAwesomeIcon icon={faChartLine} />
              <p>Select an exercise above to view detailed metrics and progress analysis.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiftMetrics;

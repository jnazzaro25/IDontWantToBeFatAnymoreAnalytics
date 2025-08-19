import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faTimes, 
  faDownload, 
  faDumbbell,
  faRunning,
  faCalendar,
  faClock,
  faFire
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

const PreviousWorkouts = () => {
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [timeRange, setTimeRange] = useState('all');

  const filterWorkouts = useCallback(() => {
    let filtered = [...allWorkouts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(workout => 
        workout.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.exercises.some(exercise => 
          exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exercise.notes.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Exercise filter
    if (selectedExercise) {
      filtered = filtered.filter(workout =>
        workout.exercises.some(exercise => 
          exercise.name.toLowerCase().includes(selectedExercise.toLowerCase())
        )
      );
    }

    // Time range filter
    if (timeRange !== 'all') {
      const daysAgo = parseInt(timeRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      
      filtered = filtered.filter(workout => 
        new Date(workout.date) >= cutoffDate
      );
    }

    setFilteredWorkouts(filtered);
  }, [allWorkouts, searchTerm, selectedExercise, timeRange]);

  useEffect(() => {
    loadSampleData();
  }, []);

  useEffect(() => {
    filterWorkouts();
  }, [filterWorkouts]);

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
          },
          {
            name: 'Squats',
            type: 'strength',
            sets: [
              { weight: 225, reps: 6 },
              { weight: 225, reps: 6 },
              { weight: 225, reps: 5 }
            ],
            notes: 'Legs were tired'
          }
        ],
        totalDuration: 45,
        notes: 'Great upper body and leg workout'
      },
      {
        id: 2,
        date: '2024-01-13',
        exercises: [
          {
            name: 'Running',
            type: 'cardio',
            duration: 30,
            distance: 3.1,
            notes: 'Easy pace, felt good'
          },
          {
            name: 'Pull-ups',
            type: 'strength',
            sets: [
              { weight: 0, reps: 8 },
              { weight: 0, reps: 7 },
              { weight: 0, reps: 6 }
            ],
            notes: 'Bodyweight exercise'
          }
        ],
        totalDuration: 50,
        notes: 'Cardio and pull day'
      },
      {
        id: 3,
        date: '2024-01-10',
        exercises: [
          {
            name: 'Deadlifts',
            type: 'strength',
            sets: [
              { weight: 275, reps: 5 },
              { weight: 275, reps: 5 },
              { weight: 275, reps: 4 }
            ],
            notes: 'Heavy deadlifts'
          },
          {
            name: 'Overhead Press',
            type: 'strength',
            sets: [
              { weight: 135, reps: 6 },
              { weight: 135, reps: 6 },
              { weight: 135, reps: 5 }
            ],
            notes: 'Shoulder strength'
          }
        ],
        totalDuration: 40,
        notes: 'Back and shoulders focus'
      }
    ];

    setAllWorkouts(sampleWorkouts);
    setFilteredWorkouts(sampleWorkouts);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedExercise('');
    setTimeRange('all');
  };

  const exportToCSV = () => {
    if (filteredWorkouts.length === 0) {
      alert('No workouts to export!');
      return;
    }

    const headers = ['Date', 'Exercise Name', 'Type', 'Set Number', 'Weight (lbs)', 'Reps', 'Duration (min)', 'Distance (miles)', 'Notes', 'Workout Notes'];
    const csvRows = [headers.join(',')];

    filteredWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (exercise.type === 'strength' && exercise.sets) {
          exercise.sets.forEach((set, index) => {
            const row = [
              workout.date,
              exercise.name,
              exercise.type,
              index + 1,
              set.weight || '',
              set.reps || '',
              '',
              '',
              `"${exercise.notes || ''}"`,
              `"${workout.notes || ''}"`
            ];
            csvRows.push(row.join(','));
          });
        } else {
          const row = [
            workout.date,
            exercise.name,
            exercise.type,
            '',
            '',
            '',
            exercise.duration || '',
            exercise.distance || '',
            `"${exercise.notes || ''}"`,
            `"${workout.notes || ''}"`
          ];
          csvRows.push(row.join(','));
        }
      });
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const timestamp = format(new Date(), 'yyyy-MM-dd');
    const filename = `workout_history_${timestamp}.csv`;
    
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculateWorkoutStats = (workout) => {
    let totalSets = 0;
    let totalReps = 0;
    let totalWeight = 0;
    let totalDuration = 0;
    let totalDistance = 0;

    workout.exercises.forEach(exercise => {
      if (exercise.type === 'strength' && exercise.sets) {
        totalSets += exercise.sets.length;
        exercise.sets.forEach(set => {
          totalReps += parseInt(set.reps) || 0;
          totalWeight += parseFloat(set.weight) || 0;
        });
      } else {
        totalDuration += exercise.duration || 0;
        totalDistance += exercise.distance || 0;
      }
    });

    return {
      totalSets,
      totalReps,
      totalWeight,
      totalDuration,
      totalDistance
    };
  };

  const getUniqueExercises = () => {
    const exercises = new Set();
    allWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercises.add(exercise.name);
      });
    });
    return Array.from(exercises).sort();
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Previous Workouts</h2>
        
        <div className="history-header">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search workouts, exercises, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FontAwesomeIcon icon={faSearch} />
          </div>
          
          <div className="filter-controls">
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
            >
              <option value="">All Exercises</option>
              {getUniqueExercises().map(exercise => (
                <option key={exercise} value={exercise}>{exercise}</option>
              ))}
            </select>
            
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
            
            <button onClick={clearFilters} className="btn btn-secondary">
              <FontAwesomeIcon icon={faTimes} /> Clear Filters
            </button>
          </div>
        </div>

        <div className="history-stats">
          <div className="stat-item">
            <FontAwesomeIcon icon={faCalendar} />
            <span>{filteredWorkouts.length} Workouts</span>
          </div>
          <div className="stat-item">
            <FontAwesomeIcon icon={faClock} />
            <span>{filteredWorkouts.reduce((total, workout) => total + (workout.totalDuration || 0), 0)} min</span>
          </div>
          <div className="stat-item">
            <FontAwesomeIcon icon={faFire} />
            <span>{filteredWorkouts.reduce((total, workout) => total + workout.exercises.length, 0)} Exercises</span>
          </div>
        </div>
      </div>

      {filteredWorkouts.length === 0 ? (
        <div className="card">
          <div className="no-entries">
            <FontAwesomeIcon icon={faSearch} />
            <p>No workouts found matching your filters.</p>
          </div>
        </div>
      ) : (
        <div className="workouts-timeline">
          {filteredWorkouts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(workout => {
              const stats = calculateWorkoutStats(workout);
              return (
                <div key={workout.id} className="workout-item">
                  <div className="workout-header">
                    <div className="workout-date">
                      <h3>{format(new Date(workout.date), 'EEEE, MMMM dd, yyyy')}</h3>
                      <span className="workout-duration">
                        {workout.totalDuration} minutes
                      </span>
                    </div>
                    <div className="workout-stats">
                      {stats.totalSets > 0 && (
                        <span className="stat-badge">
                          {stats.totalSets} sets, {stats.totalReps} reps
                        </span>
                      )}
                      {stats.totalWeight > 0 && (
                        <span className="stat-badge">
                          {stats.totalWeight} lbs total
                        </span>
                      )}
                      {stats.totalDistance > 0 && (
                        <span className="stat-badge">
                          {stats.totalDistance} miles
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="exercises-list">
                    {workout.exercises.map((exercise, index) => (
                      <div key={index} className="exercise-item">
                        <div className="exercise-header">
                          <div className="exercise-info">
                            <h4 className="exercise-name">
                              <FontAwesomeIcon 
                                icon={exercise.type === 'strength' ? faDumbbell : faRunning} 
                                className="exercise-icon"
                              />
                              {exercise.name}
                            </h4>
                            <span className="exercise-type">{exercise.type}</span>
                          </div>
                        </div>

                        {exercise.type === 'strength' && exercise.sets && exercise.sets.length > 0 && (
                          <div className="sets-display">
                            {exercise.sets.map((set, setIndex) => (
                              <div key={setIndex} className="set-display">
                                <span className="set-number">Set {setIndex + 1}:</span>
                                <span className="set-details">
                                  {set.reps} reps @ {set.weight} lbs
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {exercise.type === 'cardio' && (
                          <div className="cardio-details">
                            {exercise.duration > 0 && (
                              <span className="cardio-metric">Duration: {exercise.duration} min</span>
                            )}
                            {exercise.distance > 0 && (
                              <span className="cardio-metric">Distance: {exercise.distance} miles</span>
                            )}
                          </div>
                        )}

                        {exercise.notes && (
                          <div className="exercise-notes">
                            <FontAwesomeIcon icon={faDumbbell} />
                            {exercise.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {workout.notes && (
                    <div className="workout-notes">
                      <FontAwesomeIcon icon={faCalendar} />
                      {workout.notes}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {filteredWorkouts.length > 0 && (
        <div className="card">
          <div className="export-section">
            <h3>Export Your Workout History</h3>
            <button onClick={exportToCSV} className="btn btn-success">
              <FontAwesomeIcon icon={faDownload} /> Export to CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviousWorkouts;

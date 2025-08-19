# Workout Tracker

A modern, responsive web application for tracking your daily workouts and exercises. Built with vanilla HTML, CSS, and JavaScript, this app allows you to log exercises with detailed metrics and export your workout data to CSV files.

## Features

- **Daily Workout Tracking**: Log exercises for any date with automatic date selection
- **Comprehensive Exercise Data**: Track sets, reps, weight, duration, distance, and notes
- **Exercise Types**: Categorize exercises as Strength, Cardio, Flexibility, or Other
- **Real-time Summary**: View totals for exercises, sets, reps, and weight
- **CSV Export**: Download your workout data as CSV files for analysis
- **Local Storage**: Your data is automatically saved in your browser
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Keyboard Shortcuts**: Quick actions with keyboard commands

## How to Use

### Getting Started
1. Open `index.html` in your web browser
2. The current date will be automatically selected
3. Start adding exercises using the form

### Adding Exercises
1. **Exercise Name** (required): Enter the name of your exercise
2. **Exercise Type**: Select from Strength, Cardio, Flexibility, or Other
3. **Sets & Reps**: Enter the number of sets and reps performed
4. **Weight**: Record the weight used in pounds
5. **Duration**: Log the time spent in minutes (great for cardio)
6. **Distance**: Track distance covered in miles (for running/walking)
7. **Notes**: Add any additional information about your workout

### Managing Your Workout
- **Add Exercise**: Click "Add Exercise" or press Enter
- **Delete Exercise**: Click the trash icon on any exercise card
- **Clear Workout**: Remove all exercises for the current date
- **Save to CSV**: Download your workout data as a CSV file

### Keyboard Shortcuts
- **Ctrl/Cmd + Enter**: Add exercise quickly
- **Ctrl/Cmd + S**: Save workout to CSV

### Data Persistence
- Your workout data is automatically saved in your browser's local storage
- Data is organized by date, so you can track multiple days
- Change the date to view or edit workouts from different days

## File Structure

```
IDontWantToBeFatAnymoreAnalytics/
├── index.html          # Main application file
├── styles.css          # Styling and responsive design
├── script.js           # Application logic and functionality
└── README.md           # This documentation
```

## CSV Export Format

The exported CSV files include the following columns:
- Exercise Name
- Exercise Type
- Sets
- Reps
- Weight (lbs)
- Duration (min)
- Distance (miles)
- Notes
- Timestamp

## Browser Compatibility

This application works in all modern browsers that support:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- Local Storage API
- File Download API

## Local Development

To run the application locally:

1. Clone or download the project files
2. Open `index.html` in your web browser
3. No build process or server setup required!

## Data Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- Your workout information remains private and secure

## Future Enhancements

Potential features for future versions:
- Workout templates and routines
- Progress charts and analytics
- Exercise library with common movements
- Goal setting and tracking
- Social sharing features
- Mobile app version

## Contributing

Feel free to fork this project and submit pull requests for improvements or bug fixes.

## License

This project is open source and available under the MIT License.

---

**Start tracking your fitness journey today!** 💪

# CSV Export Guide - Workout Tracker

## How CSV Export Works

The workout tracker application automatically generates and downloads CSV files when you click the "Save Workout to CSV" button. Here's how it works:

### 1. **Automatic CSV Generation**
When you save a workout, the app:
- Collects all exercise data for the selected date
- Formats it into CSV format with proper headers
- Creates a downloadable file with a unique filename
- Automatically downloads it to your computer

### 2. **CSV File Structure**
Each CSV file contains these columns:

| Column | Description | Example |
|--------|-------------|---------|
| **Exercise Name** | Name of the exercise | "Bench Press" |
| **Exercise Type** | Category (strength/cardio/flexibility/other) | strength |
| **Sets** | Number of sets performed | 4 |
| **Reps** | Number of repetitions per set | 8 |
| **Weight (lbs)** | Weight used in pounds | 185 |
| **Duration (min)** | Time spent in minutes | 25 |
| **Distance (miles)** | Distance covered in miles | 3.1 |
| **Notes** | Additional comments | "Felt strong today" |
| **Timestamp** | When the exercise was logged | 2024-01-15T10:30:00.000Z |

### 3. **File Naming Convention**
CSV files are automatically named using this format:
```
workout_YYYY_MM_DD.csv
```

Examples:
- `workout_2024_01_15.csv` (for January 15, 2024)
- `workout_2024_12_25.csv` (for December 25, 2024)

### 4. **How to Export Your Workout**

#### **Method 1: Button Click**
1. Add exercises to your workout
2. Click the **"Save Workout to CSV"** button
3. File automatically downloads to your Downloads folder

#### **Method 2: Keyboard Shortcut**
1. Press **Ctrl + S** (Windows) or **Cmd + S** (Mac)
2. File automatically downloads

### 5. **CSV File Location**
- **Windows**: Downloads folder (usually `C:\Users\YourName\Downloads`)
- **Mac**: Downloads folder (usually `/Users/YourName/Downloads`)
- **Linux**: Downloads folder (usually `/home/YourName/Downloads`)

### 6. **Opening CSV Files**

#### **In Excel:**
1. Open Excel
2. Go to File → Open
3. Select your CSV file
4. Excel will automatically parse the data into columns

#### **In Google Sheets:**
1. Go to Google Sheets
2. File → Import
3. Upload your CSV file
4. Choose "Replace current sheet"

#### **In Numbers (Mac):**
1. Open Numbers
2. File → Open
3. Select your CSV file

### 7. **Sample CSV Output**
Here's what a typical workout CSV looks like:

```csv
Exercise Name,Exercise Type,Sets,Reps,Weight (lbs),Duration (min),Distance (miles),Notes,Timestamp
"Bench Press",strength,4,8,185,,,"Felt strong today",2024-01-15T10:30:00.000Z
"Squats",strength,4,10,225,,,"Deep squats",2024-01-15T10:45:00.000Z
"Running",cardio,,,25,3.1,"5K run",2024-01-15T11:00:00.000Z
```

### 8. **Data Analysis Possibilities**

With your CSV data, you can:

- **Track Progress**: Compare weights, reps, and sets over time
- **Create Charts**: Visualize your fitness journey
- **Calculate Totals**: Sum up weekly/monthly volume
- **Identify Trends**: See which exercises you're improving at
- **Plan Workouts**: Use historical data to plan future sessions

### 9. **Troubleshooting**

#### **File Not Downloading:**
- Check if your browser blocks downloads
- Ensure you have exercises added to your workout
- Try refreshing the page

#### **CSV Format Issues:**
- Open in Excel or Google Sheets for proper formatting
- Some text editors may not display CSV correctly
- Ensure commas in notes are properly quoted

#### **File Size:**
- CSV files are typically very small (few KB)
- Large files may indicate data duplication issues

### 10. **Advanced Usage**

#### **Multiple Workouts:**
- Export each day's workout separately
- Combine multiple CSV files in Excel for analysis
- Use date filters to analyze specific time periods

#### **Data Backup:**
- Keep CSV files as backups of your workout data
- Store them in cloud storage for safekeeping
- Use them to restore data if needed

---

## Quick Start

1. **Open the app** (`index.html`)
2. **Add exercises** to your workout
3. **Click "Save Workout to CSV"**
4. **Check your Downloads folder** for the file
5. **Open in Excel/Google Sheets** for analysis

That's it! Your workout data is now saved as a CSV file that you can analyze, share, or backup as needed. 
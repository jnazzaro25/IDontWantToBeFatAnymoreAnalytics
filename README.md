# 💪 Workout Tracker React

A comprehensive workout and weight tracking application built with React and Material-UI, featuring the SmartRent (SMRT) brand design system with professional blue and orange color themes.

## ✨ Features

### 🏋️‍♂️ **Workout Tracking**
- **Dynamic Exercise Forms**: Strength exercises with set-by-set tracking, cardio exercises with duration/distance
- **Exercise Type Validation**: Automatic form field management based on exercise type
- **Real-time Summary**: Live workout statistics and progress tracking
- **CSV Export**: Download workout data for external analysis

### 📊 **Weight & Body Composition**
- **Comprehensive Metrics**: Body weight, body fat, muscle mass, measurements
- **Auto-calculations**: BMI, body fat in pounds, lean mass
- **Progress Charts**: Multiple Chart.js visualizations for tracking progress
- **Data Export**: CSV and JSON export options

### 📈 **Performance Analytics**
- **Lift Metrics**: Detailed analysis of strength exercise performance
- **Progress Tracking**: Weight, volume, and reps progression over time
- **Performance Insights**: AI-powered recommendations and trends
- **Historical Data**: Sample workout data for demonstration

### 🎯 **Workout Templates**
- **Template Builder**: Create structured workout routines
- **Day-based Organization**: Organize templates by workout days
- **Import/Export**: JSON-based template sharing and backup
- **Quick Loading**: One-click template application to workout logs

### 📚 **Workout History**
- **Comprehensive Logs**: Complete workout history with search and filtering
- **Time-based Filtering**: Filter by date ranges (7 days, 30 days, etc.)
- **Exercise Search**: Find specific exercises across all workouts
- **Statistics Overview**: Summary metrics and trends

## 🎨 Design System

### **SmartRent-Inspired Design**
- **Professional UI**: Clean, modern interface suitable for fitness applications
- **Material-UI Foundation**: Built on Material Design principles with custom theming
- **Design Tokens**: Consistent spacing, colors, typography, and shadows
- **Responsive Design**: Mobile-first approach that scales to all screen sizes

### **Key Design Principles**
- **Consistency**: Unified visual language across all components
- **Accessibility**: WCAG compliant color contrasts and typography
- **Professional**: Clean, modern interface suitable for fitness tracking
- **Responsive**: Mobile-first design that scales to all screen sizes

### **Design Tokens**
- **Colors**: Semantic color system with workout-specific accents
- **Spacing**: 8px grid system with consistent spacing scale
- **Typography**: Open Sans font family with defined weight hierarchy
- **Shadows**: Subtle elevation system for depth and hierarchy

## 🚀 Getting Started

### **Prerequisites**
- Node.js 16+ 
- npm or yarn package manager

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd workout-tracker-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── Navigation.js    # Main navigation with Material-UI
│   ├── WorkoutTracker.js # Main workout logging interface
│   ├── WeightTracker.js # Body composition tracking
│   ├── LiftMetrics.js   # Performance analytics
│   ├── PreviousWorkouts.js # Workout history
│   └── WorkoutTemplates.js # Template management
├── design-system/       # Design system implementation
│   ├── tokens.ts        # Design tokens (colors, spacing, typography)
│   └── theme.tsx        # Material-UI theme configuration
├── App.js               # Main application with routing
└── index.js             # Application entry point
```

## 🎨 Styling & Design

### **Material-UI Integration**
- **Custom Theme**: Tailored Material-UI theme with our design tokens
- **Component Library**: Leverage MUI components with consistent styling
- **System Props**: Use `sx` prop for responsive and consistent styling
- **Design Tokens**: Import and use predefined design values

### **Responsive Design**
- **Mobile-First**: Start with mobile layouts, enhance for larger screens
- **Breakpoint System**: Use MUI's responsive breakpoints
- **Flexible Layouts**: Grid system that adapts to screen sizes
- **Touch-Friendly**: Optimized for mobile and tablet interactions

### **Customization**
- **Design Tokens**: Easy to modify colors, spacing, and typography
- **Theme Overrides**: Customize MUI component styles
- **Component Variants**: Create consistent component variations
- **CSS-in-JS**: Styled components with design system integration

## 📱 Responsive Features

### **Mobile Experience**
- **Touch-Optimized**: Large touch targets and intuitive gestures
- **Stacked Layouts**: Vertical layouts for small screens
- **Simplified Navigation**: Tab-based navigation for mobile
- **Optimized Forms**: Mobile-friendly input fields and buttons

### **Desktop Experience**
- **Multi-Column Layouts**: Efficient use of screen real estate
- **Advanced Interactions**: Hover effects and detailed tooltips
- **Keyboard Navigation**: Full keyboard accessibility
- **Data Visualization**: Enhanced charts and analytics views

## 🔧 Development

### **Available Scripts**
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm eject` - Eject from Create React App

### **Code Style**
- **ESLint**: Consistent code formatting and quality
- **Prettier**: Automatic code formatting
- **TypeScript**: Type-safe development (future enhancement)
- **Component Structure**: Functional components with hooks

### **State Management**
- **React Hooks**: useState, useEffect, useCallback for state
- **Local Storage**: Persistent data storage
- **Context API**: Future enhancement for global state
- **Data Flow**: Unidirectional data flow with props

## 🎯 Future Enhancements

### **Planned Features**
- **User Authentication**: Secure user accounts and data
- **Cloud Sync**: Cross-device data synchronization
- **Advanced Analytics**: Machine learning insights
- **Social Features**: Workout sharing and community
- **Mobile App**: React Native application

### **Technical Improvements**
- **TypeScript**: Full type safety implementation
- **Testing**: Comprehensive test coverage
- **Performance**: Code splitting and optimization
- **Accessibility**: Enhanced WCAG compliance

## 📚 Documentation

- **[Styling Guide](STYLING_GUIDE.md)**: Comprehensive design system documentation
- **[Component API](docs/components.md)**: Detailed component documentation
- **[Design Tokens](docs/tokens.md)**: Complete design token reference
- **[Best Practices](docs/best-practices.md)**: Development guidelines

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Contribution Guidelines**
- Follow the existing code style and patterns
- Use the design system tokens for styling
- Ensure responsive design for all new components
- Add appropriate tests for new functionality
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **SmartRent js-shared**: Design system inspiration and patterns
- **Material-UI**: Component library and theming system
- **Chart.js**: Data visualization capabilities
- **React Community**: Framework and ecosystem

---

**Built with ❤️ and 💪 for fitness enthusiasts everywhere!**

For questions, issues, or contributions, please open an issue or pull request on GitHub.

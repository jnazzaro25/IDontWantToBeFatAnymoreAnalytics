# 🎨 Workout Tracker Styling Guide

This document outlines the design system and styling patterns used in the Workout Tracker application, inspired by the SmartRent js-shared repository.

## 🎯 Design Philosophy

Our design system follows these core principles:
- **Consistency**: Unified visual language across all components
- **Accessibility**: WCAG compliant color contrasts and typography
- **Professional**: Clean, modern interface suitable for fitness tracking
- **Responsive**: Mobile-first design that scales to all screen sizes

## 🎨 Design Tokens

### Colors

#### Base Colors
```typescript
import { colors } from './design-system/tokens';

// Primary palette
colors.primary600    // Main brand color
colors.primary400    // Light variant
colors.primary800    // Dark variant

// Semantic colors
colors.success500    // Success states
colors.error500      // Error states
colors.warning500    // Warning states
colors.info500       // Information states

// Workout-specific colors
colors.workout600    // Strength training
colors.cardio500     // Cardio exercises
```

#### Gray Scale
```typescript
colors.gray050       // Lightest background
colors.gray100       // Light background
colors.gray500       // Medium text
colors.gray900       // Primary text
colors.gray950       // Darkest text
```

### Spacing

```typescript
import { spacing } from './design-system/tokens';

// Use consistent spacing values
spacing.xs           // 8px
spacing.sm           // 12px
spacing.md           // 16px
spacing.lg           // 20px
spacing.xl           // 24px
spacing.xxl          // 32px

// Aliases for common use cases
spacing.cardPadding  // 24px - Card padding
spacing.sectionGap   // 32px - Between sections
spacing.pagePadding  // 24px - Page margins
```

### Typography

```typescript
import { typography } from './design-system/tokens';

// Font family
typography.fontFamily // 'Open Sans', sans-serif

// Font weights
typography.fontWeights.light      // 300
typography.fontWeights.regular    // 400
typography.fontWeights.semibold   // 600
typography.fontWeights.bold       // 700

// Font sizes
typography.fontSizes.sm           // 14px
typography.fontSizes.base         // 16px
typography.fontSizes.lg           // 18px
typography.fontSizes.xl           // 20px
typography.fontSizes['2xl']       // 24px
```

## 🧩 Component Usage

### Material-UI Integration

Our design system is built on top of Material-UI (MUI) with custom theming:

```typescript
import { Box, Card, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <Card sx={{ p: 3, mb: 2 }}>
      <Typography variant="h5" gutterBottom>
        Component Title
      </Typography>
      <Button variant="contained" color="primary">
        Action Button
      </Button>
    </Card>
  );
};
```

### Styling with System Props

Use MUI's `sx` prop for consistent styling:

```typescript
// Spacing
<Box sx={{ p: 3, m: 2, mb: 4 }}>  // padding: 24px, margin: 16px, margin-bottom: 32px

// Colors
<Box sx={{ bgcolor: 'primary.main', color: 'white' }}>

// Typography
<Typography sx={{ fontWeight: 'semibold', fontSize: 'lg' }}>

// Layout
<Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
```

### Custom Styling

For custom styles that aren't covered by the design system:

```typescript
<Box
  sx={{
    // Use design tokens
    backgroundColor: colors.workout100,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.base,
    
    // Custom styles
    border: `2px solid ${colors.workout300}`,
    transition: transitions.normal,
    
    // Hover effects
    '&:hover': {
      backgroundColor: colors.workout200,
      boxShadow: shadows.md,
    }
  }}
>
```

## 📱 Responsive Design

### Breakpoints

```typescript
import { useTheme, useMediaQuery } from '@mui/material';

const MyComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  return (
    <Box sx={{
      // Responsive spacing
      p: { xs: 2, sm: 3, md: 4 },
      
      // Responsive layout
      flexDirection: { xs: 'column', md: 'row' },
      
      // Responsive typography
      fontSize: { xs: 'sm', md: 'base' }
    }}>
      {/* Component content */}
    </Box>
  );
};
```

### Mobile-First Approach

```typescript
// Start with mobile styles, then enhance for larger screens
<Box sx={{
  // Base (mobile) styles
  padding: 2,
  fontSize: 'sm',
  
  // Tablet and up
  '@media (min-width: 600px)': {
    padding: 3,
    fontSize: 'base',
  },
  
  // Desktop and up
  '@media (min-width: 900px)': {
    padding: 4,
    fontSize: 'lg',
  }
}}>
```

## 🎨 Layout Patterns

### Card Layout

```typescript
import { Card, CardContent, CardHeader } from '@mui/material';

<Card sx={{ mb: 3 }}>
  <CardHeader
    title="Section Title"
    subheader="Optional description"
    sx={{ pb: 1 }}
  />
  <CardContent sx={{ pt: 0 }}>
    {/* Card content */}
  </CardContent>
</Card>
```

### Form Layout

```typescript
import { TextField, Button, Box } from '@mui/material';

<Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
  <TextField
    label="Input Label"
    variant="outlined"
    fullWidth
    required
  />
  <Button type="submit" variant="contained" size="large">
    Submit
  </Button>
</Box>
```

### Grid Layout

```typescript
import { Grid } from '@mui/material';

<Grid container spacing={3}>
  <Grid item xs={12} md={6}>
    {/* Half width on desktop, full width on mobile */}
  </Grid>
  <Grid item xs={12} md={6}>
    {/* Half width on desktop, full width on mobile */}
  </Grid>
</Grid>
```

## 🚀 Best Practices

### 1. Use Design Tokens
Always use the predefined design tokens instead of hardcoded values:

```typescript
// ✅ Good
<Box sx={{ p: 3, color: 'primary.main' }}>

// ❌ Bad
<Box sx={{ p: '24px', color: '#825BE2' }}>
```

### 2. Consistent Spacing
Use the spacing scale for consistent layouts:

```typescript
// ✅ Good - Consistent spacing
<Box sx={{ p: 3, mb: 2, mt: 4 }}>

// ❌ Bad - Inconsistent spacing
<Box sx={{ p: '20px', mb: '16px', mt: '30px' }}>
```

### 3. Semantic Colors
Use semantic colors for their intended purpose:

```typescript
// ✅ Good - Semantic usage
<Alert severity="success">Workout saved!</Alert>
<Alert severity="error">Please fill all required fields</Alert>

// ❌ Bad - Misusing colors
<Box sx={{ color: 'error.main' }}>Success message</Box>
```

### 4. Responsive Design
Always consider mobile users:

```typescript
// ✅ Good - Mobile-first
<Box sx={{
  p: { xs: 2, md: 4 },
  fontSize: { xs: 'sm', md: 'base' }
}}>

// ❌ Bad - Desktop-only
<Box sx={{ p: 4, fontSize: 'base' }}>
```

## 🔧 Customization

### Adding New Colors

```typescript
// In src/design-system/tokens.ts
export const colors = {
  // ... existing colors
  
  // New custom colors
  custom100: "#E8F4F8",
  custom500: "#2E8B57",
  custom900: "#1B4D3E",
};
```

### Adding New Spacing Values

```typescript
// In src/design-system/tokens.ts
export const spacing = {
  // ... existing spacing
  
  // New custom spacing
  custom: 28,
  extraWide: 48,
};
```

### Theme Overrides

```typescript
// In src/design-system/theme.tsx
const theme = createTheme({
  // ... existing theme
  
  components: {
    // ... existing components
    
    MuiCustomComponent: {
      styleOverrides: {
        root: {
          // Custom styles
        }
      }
    }
  }
});
```

## 📚 Resources

- [Material-UI Documentation](https://mui.com/)
- [SmartRent js-shared Repository](https://github.com/smartrent/js-shared)
- [Design Tokens Guide](https://www.designtokens.org/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🎯 Getting Started

1. **Import the design tokens**: `import { colors, spacing, typography } from './design-system/tokens'`
2. **Use Material-UI components**: Leverage the built-in components with our custom theme
3. **Apply consistent spacing**: Use the spacing scale for all margins and padding
4. **Follow the color system**: Use semantic colors for their intended purpose
5. **Make it responsive**: Always consider mobile users first

This design system ensures consistency, accessibility, and professional appearance across your workout tracking application! 🎨💪

# SmartRent js-shared Design System Integration

This document outlines how the workout tracker application aligns with SmartRent's design system from their [js-shared repository](https://github.com/smartrent/js-shared).

## 🎨 Design Token Structure

Our design tokens follow the typical structure found in SmartRent's js-shared repository:

### Brand Colors
```javascript
brand: {
  primary: "#2B94FF",    // SmartRent brand blue
  secondary: "#FF9500",  // SmartRent accent orange  
  tertiary: "#9C27B0",   // SmartRent tertiary purple
}
```

### Color Palette Structure
- **Primary Colors**: Blue spectrum (`primary100` → `primary900`)
- **Secondary Colors**: Orange spectrum (`secondary100` → `secondary900`) 
- **Tertiary Colors**: Purple spectrum (`tertiary100` → `tertiary900`)
- **Semantic Colors**: Standard success, error, warning, info

### Application-Specific Colors
```javascript
fitness: {
  strength: "#FF9500",    // Orange for strength training
  cardio: "#9C27B0",      // Purple for cardio  
  recovery: "#4CAF50",    // Green for recovery/rest
}
```

## 🧱 Component Alignment

### Material-UI Theme Integration
- Primary theme uses SmartRent brand blue (`#2B94FF`)
- Secondary theme uses SmartRent accent orange (`#FF9500`)
- Typography follows SmartRent's professional standards
- Spacing uses consistent 8px grid system

### Design System Benefits
✅ **Brand Consistency**: Matches SmartRent's visual identity  
✅ **Professional Aesthetic**: Corporate-friendly appearance  
✅ **Scalability**: Easy to extend with new SmartRent components  
✅ **Accessibility**: Follows Material Design standards  

## 🔧 Implementation Details

### Design Token Location
- `src/design-system/tokens.js` - Core design tokens
- `src/design-system/theme.js` - Material-UI theme configuration

### Color Usage Guidelines
- **Primary Blue**: Main actions, navigation, primary buttons
- **Secondary Orange**: Call-to-action buttons, highlights, strength exercises  
- **Tertiary Purple**: Secondary actions, cardio exercises
- **Neutral Grays**: Backgrounds, text, borders

## 🚀 Future js-shared Integration

To fully integrate with SmartRent's js-shared repository:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/smartrent/js-shared.git
   ```

2. **Install as Dependency**:
   ```bash
   npm install @smartrent/js-shared
   ```

3. **Import Shared Components**:
   ```javascript
   import { Button, Card, Input } from '@smartrent/js-shared';
   ```

4. **Use Shared Design Tokens**:
   ```javascript
   import { colors, spacing, typography } from '@smartrent/js-shared/tokens';
   ```

## 📚 References

- [SmartRent js-shared Repository](https://github.com/smartrent/js-shared)
- [SmartRent Branding Guidelines](https://smartrent.com/)
- [Material-UI Theming](https://mui.com/material-ui/customization/theming/)

## 📝 Notes

This implementation provides a foundation that can easily integrate with SmartRent's official js-shared components when they become available as npm packages or when the specific design tokens are published.

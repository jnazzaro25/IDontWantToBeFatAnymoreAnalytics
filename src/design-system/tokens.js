// Design Tokens based on SmartRent js-shared repository
// This provides a consistent design system for the workout tracker

export const colors = {
  // Base colors
  white: "#FFFFFF",
  black: "#000000",
  
  // Gray scale
  gray050: "#FBFCFD",
  gray075: "#F0F2F4",
  gray085: "#F2F3F6",
  gray100: "#EDEFF2",
  gray200: "#CCD1D8",
  gray300: "#BCC5CF",
  gray400: "#95A0AC",
  gray500: "#747B86",
  gray600: "#676F79",
  gray700: "#40464E",
  gray800: "#2E3237",
  gray900: "#1D2025",
  gray925: "#17191D",
  gray950: "#131518",
  
  // Semantic colors
  success100: "#E8FCE8",
  success200: "#B0EEB0",
  success300: "#6CCC6D",
  success400: "#34AD48",
  success500: "#0A8930",
  success600: "#097228",
  success700: "#056121",
  success800: "#034516",
  success900: "#013202",
  
  error100: "#FCE8E9",
  error200: "#FFB3B5",
  error300: "#FF6669",
  error400: "#FB505B",
  error500: "#E3273F",
  error600: "#C51B31",
  error700: "#9D0C1F",
  error800: "#710513",
  error900: "#4E030D",
  
  warning100: "#FCF4E8",
  warning200: "#FAE5C6",
  warning300: "#FFBE66",
  warning400: "#FFAA38",
  warning500: "#FF9200",
  warning600: "#E57906",
  warning700: "#CA6902",
  warning800: "#994F00",
  warning900: "#663500",
  
  info100: "#D9EBFC",
  info200: "#A0CCF8",
  info300: "#61AAF2",
  info400: "#1D8BE2",
  info500: "#0378D4",
  info600: "#0566B3",
  info700: "#034F8C",
  info800: "#003966",
  info900: "#00223D",
  
  // Accent colors
  primary100: "#E5DDF9",
  primary200: "#D3C5F5",
  primary300: "#C0ADF0",
  primary400: "#AE95EC",
  primary500: "#9473E6",
  primary600: "#825BE2",
  primary700: "#6B3DDD",
  primary800: "#5926D7",
  primary900: "#4F22BF",
  
  // Workout-specific colors
  workout100: "#E8F5E8",
  workout200: "#C3E6C3",
  workout300: "#9DD79D",
  workout400: "#78C878",
  workout500: "#52B952",
  workout600: "#42A342",
  workout700: "#318D31",
  workout800: "#217721",
  workout900: "#106110",
  
  cardio100: "#E8F0F8",
  cardio200: "#C3D9ED",
  cardio300: "#9EC2E2",
  cardio400: "#79ABD7",
  cardio500: "#5494CC",
  cardio600: "#4376A3",
  cardio700: "#32587A",
  cardio800: "#213A52",
  cardio900: "#111C29",
};

export const spacing = {
  // Global spacing scale
  xxxs: 2,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  narrow: 10,
  wide: 18,
  
  // Aliases
  raisedSurfacePadding: 16,
  cardGap: 12,
  cardPadding: 24,
  sectionGap: 32,
  pagePadding: 24,
  buttonPadding: 12,
  inputPadding: 16,
};

export const typography = {
  fontFamily: "'Open Sans', sans-serif",
  fontWeights: {
    light: 300,
    regular: 400,
    semibold: 600,
    bold: 700,
  },
  fontSizes: {
    xs: "0.75rem",    // 12px
    sm: "0.875rem",   // 14px
    base: "1rem",     // 16px
    lg: "1.125rem",   // 18px
    xl: "1.25rem",    // 20px
    "2xl": "1.5rem",  // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem",  // 36px
    "5xl": "3rem",     // 48px
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
};

export const borderRadius = {
  none: 0,
  sm: "0.125rem",    // 2px
  base: "0.25rem",   // 4px
  md: "0.375rem",    // 6px
  lg: "0.5rem",      // 8px
  xl: "0.75rem",     // 12px
  "2xl": "1rem",     // 16px
  "3xl": "1.5rem",   // 24px
  full: "9999px",
};

export const transitions = {
  fast: "150ms ease-in-out",
  normal: "250ms ease-in-out",
  slow: "350ms ease-in-out",
};

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

// Theme object for easy consumption
export const theme = {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
  transitions,
  breakpoints,
};

export default theme;

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { colors, spacing, typography, shadows, borderRadius, transitions } from './tokens.js';

// Create Material-UI theme based on SmartRent (SMRT) brand design system
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary600,
      light: colors.primary400,
      dark: colors.primary800,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.secondary600,
      light: colors.secondary400,
      dark: colors.secondary800,
      contrastText: colors.white,
    },
    success: {
      main: colors.success500,
      light: colors.success300,
      dark: colors.success700,
      contrastText: colors.white,
    },
    error: {
      main: colors.error500,
      light: colors.error300,
      dark: colors.error700,
      contrastText: colors.white,
    },
    warning: {
      main: colors.warning500,
      light: colors.warning300,
      dark: colors.warning700,
      contrastText: colors.white,
    },
    info: {
      main: colors.info500,
      light: colors.info300,
      dark: colors.info700,
      contrastText: colors.white,
    },
    text: {
      primary: colors.gray900,
      secondary: colors.gray700,
      disabled: colors.gray400,
    },
    background: {
      default: colors.white,
      paper: colors.white,
    },
    divider: colors.gray200,
  },
  typography: {
    fontFamily: typography.fontFamily,
    h1: {
      fontSize: typography.fontSizes['5xl'],
      fontWeight: typography.fontWeights.bold,
      lineHeight: typography.lineHeights.tight,
      color: colors.gray900,
    },
    h2: {
      fontSize: typography.fontSizes['4xl'],
      fontWeight: typography.fontWeights.bold,
      lineHeight: typography.lineHeights.tight,
      color: colors.gray900,
    },
    h3: {
      fontSize: typography.fontSizes['3xl'],
      fontWeight: typography.fontWeights.semibold,
      lineHeight: typography.lineHeights.tight,
      color: colors.gray900,
    },
    h4: {
      fontSize: typography.fontSizes['2xl'],
      fontWeight: typography.fontWeights.semibold,
      lineHeight: typography.lineHeights.normal,
      color: colors.gray900,
    },
    h5: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.semibold,
      lineHeight: typography.lineHeights.normal,
      color: colors.gray900,
    },
    h6: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      lineHeight: typography.lineHeights.normal,
      color: colors.gray900,
    },
    body1: {
      fontSize: typography.fontSizes.base,
      fontWeight: typography.fontWeights.regular,
      lineHeight: typography.lineHeights.normal,
      color: colors.gray900,
    },
    body2: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.regular,
      lineHeight: typography.lineHeights.normal,
      color: colors.gray700,
    },
    button: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.semibold,
      lineHeight: typography.lineHeights.tight,
      textTransform: 'none',
    },
    caption: {
      fontSize: typography.fontSizes.xs,
      fontWeight: typography.fontWeights.regular,
      lineHeight: typography.lineHeights.normal,
      color: colors.gray600,
    },
  },
  shape: {
    borderRadius: parseInt(borderRadius.lg),
  },
  spacing: (factor) => spacing.xs * factor,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
          padding: `${spacing.buttonPadding}px ${spacing.lg}px`,
          transition: transitions.normal,
          boxShadow: shadows.sm,
          '&:hover': {
            boxShadow: shadows.md,
          },
        },
        contained: {
          '&:hover': {
            boxShadow: shadows.lg,
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
          boxShadow: shadows.base,
          transition: transitions.normal,
          '&:hover': {
            boxShadow: shadows.md,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: borderRadius.md,
            transition: transitions.fast,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary400,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary600,
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
          boxShadow: shadows.base,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: shadows.sm,
          backgroundColor: colors.primary600,
          color: colors.white,
          '& .MuiTypography-root': {
            color: colors.white,
          },
          '& .MuiTab-root': {
            color: colors.white,
            opacity: 0.8,
            '&.Mui-selected': {
              color: colors.white,
              opacity: 1,
            },
            '&:hover': {
              opacity: 1,
            },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: colors.white,
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: shadows.lg,
          '&:hover': {
            boxShadow: shadows.xl,
          },
        },
      },
    },
  },
});

const AppThemeProvider = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export { AppThemeProvider };
export default theme;

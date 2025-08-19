import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { colors, spacing, typography, shadows, borderRadius, transitions } from './tokens';

// Create Material-UI theme based on SmartRent design system
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
      main: colors.workout600,
      light: colors.workout400,
      dark: colors.workout800,
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
      secondary: colors.gray600,
      disabled: colors.gray400,
    },
    background: {
      default: colors.gray050,
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
      color: colors.gray600,
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
      color: colors.gray500,
    },
  },
  shape: {
    borderRadius: parseInt(borderRadius.lg),
  },
  spacing: (factor: number) => spacing.xs * factor,
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

interface AppThemeProviderProps {
  children: React.ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default theme;

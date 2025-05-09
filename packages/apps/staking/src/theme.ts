import { createTheme } from '@mui/material/styles';
import {
  PaletteColorOptions,
  PaletteColor,
} from '@mui/material/styles/createPalette';
import { ThemeOptions } from '@mui/material';
import { colorPalette } from './assets/styles/color-palette';
import { CSSProperties } from 'react';

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    ['Components/Button Small']: true;
    ['Components/Button Large']: true;
    ['Components/Chip']: true;
    ['Components/Table Header']: true;
    ['H6-Mobile']: true;
    body3: true;
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    ['Components/Button Small']: CSSProperties;
    ['Components/Button Large']: CSSProperties;
    ['Components/Chip']: CSSProperties;
    ['Components/Table Header']: CSSProperties;
    ['H6-Mobile']: CSSProperties;
    body3: CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    ['Components/Button Small']?: CSSProperties;
    ['Components/Button Large']?: CSSProperties;
    ['Components/Chip']?: CSSProperties;
    ['Components/Table Header']?: CSSProperties;
    ['H6-Mobile']: CSSProperties;
    body3?: CSSProperties;
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    sky: PaletteColor;
    white: PaletteColor;
    textSecondary: PaletteColor;
  }
  interface PaletteOptions {
    sky?: PaletteColorOptions;
    white?: PaletteColorOptions;
    textSecondary?: PaletteColorOptions;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    sky: true;
    white: true;
    textSecondary: true;
  }
}

declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides {
    sky: true;
    white: true;
    textSecondary: true;
  }
}

declare module '@mui/material/SvgIcon' {
  interface SvgIconPropsColorOverrides {
    sky: true;
    white: true;
    textSecondary: true;
  }
}

const theme: ThemeOptions = createTheme({
  palette: {
    primary: {
      main: colorPalette.primary.main,
      light: colorPalette.primary.light,
    },
    info: {
      main: colorPalette.info.main,
      light: colorPalette.info.light,
      dark: colorPalette.info.dark,
    },
    secondary: {
      main: colorPalette.secondary.main,
      light: colorPalette.secondary.light,
    },
    text: {
      primary: colorPalette.primary.main,
      secondary: colorPalette.fog.main,
    },
    sky: {
      main: colorPalette.sky.main,
      light: colorPalette.sky.light,
      dark: colorPalette.sky.dark,
      contrastText: colorPalette.sky.contrastText,
    },
    white: {
      main: '#fff',
      light: '#fff',
      dark: '#fff',
      contrastText: '#fff',
    },
    textSecondary: colorPalette.textSecondary,
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h1: {
      fontSize: 32,
      fontWeight: 600,
    },
    h2: {
      fontSize: 34,
      fontWeight: 600,
    },
    h3: {
      fontSize: 24,
      fontWeight: 500,
    },
    h4: {
      fontSize: 20,
      fontWeight: 500,
    },
    h5: {
      fontSize: 18,
      fontWeight: 600,
    },
    h6: {
      fontSize: 20,
      fontWeight: 500,
    },
    'H6-Mobile': {
      fontSize: '20px',
      fontWeight: 500,
      lineHeight: '32px',
      letterSpacing: '0.15px',
      textAlign: 'left',
    },
    body1: {
      fontSize: 16,
      fontWeight: 400,
    },
    body2: {
      fontSize: 14,
      fontWeight: 500,
    },
    body3: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '19.92px',
      letterSpacing: '0.4px',
      textAlign: 'left',
    },
    'Components/Button Small': {
      fontSize: '13px',
      fontWeight: 600,
      lineHeight: '22px',
      letterSpacing: '0.1px',
      textAlign: 'left',
    },
    'Components/Button Large': {
      fontSize: '15px',
      fontWeight: 600,
      lineHeight: '26px',
      letterSpacing: '0.1px',
      textAlign: 'left',
    },
    'Components/Chip': {
      fontSize: '13px',
      fontWeight: 400,
      lineHeight: '18px',
      letterSpacing: '0.16px',
      textAlign: 'left',
    },
    'Components/Table Header': {
      fontFamily: 'Roboto',
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '24px',
      letterSpacing: '0.17px',
      textAlign: 'left',
    },
    subtitle1: {
      fontSize: 12,
    },
    subtitle2: {
      fontSize: 14,
      fontWeight: 600,
      lineHeight: '21.9px',
    },
    caption: {
      fontSize: 10,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          fontWeight: 600,
          textTransform: 'none',

          '&:disabled': {
            backgroundColor: '#FBFBFE',
            color: 'rgba(203, 207, 232, 0.86)',
            border: 'none',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colorPalette.secondary.main,
          color: colorPalette.whiteSolid,
        },
        arrow: {
          color: colorPalette.secondary.main,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        sizeMedium: {
          color: colorPalette.primary.main,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          borderWidth: 2,
          color: colorPalette.primary.main,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colorPalette.primary.main,
            borderWidth: 2,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colorPalette.primary.main,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colorPalette.primary.main,
          },
          '& .MuiSvgIcon-root': {
            color: colorPalette.primary.main,
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          wordBreak: 'break-word',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: colorPalette.white,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#1406B207',
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        toolbar: {
          '@media (max-width: 440px)': {
            display: 'grid',
            gridTemplateColumns: '1fr 3fr 2fr',
            gridTemplateRows: 'auto auto',
            gridAutoFlow: 'row',
          },
        },
        selectLabel: {
          '@media (max-width: 440px)': {
            gridColumn: '2 / 3',
            gridRow: '1',
            whiteSpace: 'nowrap',
            color: colorPalette.fog.main,
            justifySelf: 'end',
            marginBottom: `17px`,
            position: 'relative',
            right: '-38px',
          },
          '&:focus': {
            background: 'inherit',
          },
        },
        input: {
          '@media (max-width: 440px)': {
            gridColumn: '3 / 3',
            gridRow: '1',
            marginRight: '8px',
            width: '48px',
            justifySelf: 'flex-end',
          },
        },
        select: {
          '&:focus': {
            background: 'inherit',
          },
        },
        displayedRows: {
          '@media (max-width: 440px)': {
            gridColumn: '2 / 3',
            gridRow: '2',
            justifySelf: 'end',
            position: 'relative',
            right: '-12px',
          },
        },
        actions: {
          '@media (max-width: 440px)': {
            gridColumn: '3 / 3',
            gridRow: '2',
            justifySelf: 'end',
            marginLeft: 0,
            minWidth: '90px',
          },
          button: {
            marginLeft: '5px',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          color: colorPalette.link,
          '&:hover': {
            color: `${colorPalette.linkHover}!important`,
          },
          '&:visited': {
            color: colorPalette.linkVisited,
          },
        },
      },
    },
  },
});

export default theme;

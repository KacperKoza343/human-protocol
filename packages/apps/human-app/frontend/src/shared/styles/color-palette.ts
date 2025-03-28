export const colorPalette = {
  white: '#FFFFFF',
  black: '#000000',
  backgroundColor: '#FFFFFF',
  text: {
    primary: '#320A8D',
    secondary: '#B2AFC1',
    disabled: '#CBCFE6',
    disabledSecondary: '#8494C3',
  },
  primary: {
    main: '#320A8D',
    light: '#6309FF',
    dark: '#100735',
    contrastText: '#F9FAFF',
    shades: '#DADEF0CC',
  },
  secondary: {
    main: '#6309FF',
    dark: '#4506B2',
    light: '#8409FF',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#FA2A75',
    dark: '#F20D5F',
    light: '#FF5995',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#0AD397',
    dark: '#0E976E',
    light: '#00EDA6',
    contrastText: '#FFFFFF',
  },
  paper: {
    main: '#F6F7FE',
    light: '#F6F6FF',
    text: '#CBCFE8',
    disabled: '#FBFBFE',
  },
  chip: {
    main: 'rgba(203, 207, 232, 0.28)',
  },
  button: {
    disabled: '#E6E7EF',
  },
  banner: {
    background: { primary: '#320A8D', secondary: '#1C133F' },
    text: {
      primary: '#CDC7FF',
      secondary: '#FFFFFF',
    },
  },
};

export type ColorPalette = typeof colorPalette;

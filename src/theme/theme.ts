import { createTheme, PaletteMode } from '@mui/material'
import { pink } from '@mui/material/colors'

const baseTheme = {
  palette: {
    primary: {
      main: '#7FFFD4',
    },
  },
}

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: pink,
          divider: '#938e94',
          background: {
            default: '#f2f3f8',
            paper: '#ffffff',
          },
          text: {
            primary: '#3f3f3f',
            secondary: '#555555',
          },
        }
      : {
          // palette values for dark mode
          primary: pink,
          divider: '#938e94',
          background: {
            default: '#383438',
            paper: '#383438',
          },
          text: {
            primary: '#b8b3b9',
            secondary: '#938e94',
          },
        }),
  },
})

const theme = createTheme(baseTheme)

export default theme

import { createTheme, Theme, PaletteMode } from '@mui/material'
import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
  FC,
} from 'react'
import { getDesignTokens } from './theme.ts'

type ThemeContextType = {
  mode: 'light' | 'dark'
  toggleColorMode: () => void
  theme: Theme
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleColorMode: () => {},
  theme: createTheme(),
})

export const ThemeContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light')

  const toggleColorMode = () =>
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'))

  const theme = useMemo(
    () => createTheme(getDesignTokens(mode as PaletteMode)),
    [mode]
  )
  return (
    <ThemeContext.Provider value={{ mode, theme, toggleColorMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => {
  return useContext(ThemeContext)
}

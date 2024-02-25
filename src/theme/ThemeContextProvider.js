// import { createTheme, Theme } from "@mui/material";
// import { createContext, FC, PropsWithChildren, useContext } from "react";
// import { useColorTheme } from "./use-color-theme";

import { createTheme } from '@mui/material'
import { createContext, useContext, useMemo, useState } from 'react'
// import { useColorTheme } from './use-color-theme'
import { getDesignTokens } from './theme'

// type ThemeContextType = {
//   mode: string;
//   toggleColorMode: () => void;
//   theme: Theme;
// };

// export const ThemeContext = createContext<ThemeContextType>({
export const ThemeContext = createContext({
  mode: 'light',
  toggleColorMode: () => {},
  theme: createTheme(),
})

// export const ThemeContextProvider: FC<PropsWithChildren> = ({ children }) => {
export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState('light')

  const toggleColorMode = () =>
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'))

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode])
  return (
    <ThemeContext.Provider value={{ mode, theme, toggleColorMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => {
  return useContext(ThemeContext)
}

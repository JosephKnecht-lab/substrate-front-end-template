// import { createTheme, PaletteMode } from "@mui/material";
// import React from "react";
// import theme, { getDesignTokens } from "./theme";

import { createTheme } from '@mui/material'
import React from 'react'
import { getDesignTokens } from './theme'

export const useColorTheme = () => {
  //   const [mode, setMode] = React.useState < PaletteMode > 'light'
  const [mode, setMode] = React.useState('light')

  const toggleColorMode = () =>
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'))

  const modifiedTheme = React.useMemo(
    () => createTheme(getDesignTokens(mode)),
    [mode]
  )

  return {
    theme: modifiedTheme,
    mode,
    toggleColorMode,
  }
}

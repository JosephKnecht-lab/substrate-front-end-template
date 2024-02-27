import React, { createRef } from 'react'
import './global.css'

import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material'
import { ThemeProvider, Grid as MUIGrid } from '@mui/material'
import {
  useThemeContext,
  ThemeContextProvider,
} from './theme/ThemeContextProvider.tsx'

import {
  SubstrateContextProvider,
  useSubstrateState,
} from './substrate-lib/index.tsx'
import { DeveloperConsole } from './substrate-lib/components/index.tsx'

import AccountSelector from './AccountSelector.tsx'
import Balances from './Balances.tsx'
import BlockNumber from './BlockNumber.tsx'
import Events from './Events.tsx'
import Interactor from './Interactor.tsx'
import Metadata from './Metadata.tsx'
import NodeInfo from './NodeInfo.tsx'
import TemplateModule from './TemplateModule.tsx'
import Transfer from './Transfer.tsx'
import Upgrade from './Upgrade.tsx'

function Main() {
  const { apiState, apiError, keyringState } = useSubstrateState()
  const { theme, mode } = useThemeContext()

  console.log('mode', mode)

  const loader = (text: string) => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: '#262626',
        width: '100%',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <CircularProgress style={{ color: '#b8b3b9' }} size={25} />
      <Typography variant="body2" sx={{ color: '#b8b3b9' }}>
        {text}
      </Typography>
    </Box>
  )

  const message = (errObj: { target: { url: string } }) => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: mode === 'dark' ? '#2d292d' : '#f8f7f7',
        width: '100%',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <Alert severity="error">
        <AlertTitle>Error Connecting to Substrate</AlertTitle>
        {`Connection to websocket '${errObj.target.url}' failed.`}
      </Alert>
    </Box>
  )

  if (apiState === 'ERROR') return message(apiError)
  else if (apiState !== 'READY') return loader('Connecting to Substrate')

  if (keyringState !== 'READY') {
    return loader(
      "Loading accounts (please review any extension's authorization)"
    )
  }

  const contextRef = createRef()

  return (
    <div ref={contextRef as React.RefObject<HTMLDivElement>}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            backgroundColor: mode === 'dark' ? '#2d292d' : '#f8f7f7',
            minHeight: '100vh',
            my: 0,
            width: '100%',
            py: 3,
          }}
        >
          <Container maxWidth="xl" sx={{ minHeight: '100vh', flexGrow: 1 }}>
            <AccountSelector />
            <Box>
              <MUIGrid container spacing={2} sx={{ mt: '35px' }}>
                <NodeInfo />
                <Metadata />
                <BlockNumber finalized={false} />
                <BlockNumber finalized />
              </MUIGrid>
              <Balances />
              <MUIGrid container sx={{ mt: '40px' }} spacing={10}>
                <MUIGrid item xs={6}>
                  <Transfer />
                  <Interactor />
                </MUIGrid>
                <MUIGrid item xs={6}>
                  <Upgrade />
                  <Events />
                </MUIGrid>
              </MUIGrid>

              <Box>
                <TemplateModule />
              </Box>
            </Box>
          </Container>
          <DeveloperConsole />
        </Box>
      </ThemeProvider>
    </div>
  )
}

export default function App() {
  return (
    <SubstrateContextProvider>
      <ThemeContextProvider>
        <Main />
      </ThemeContextProvider>
    </SubstrateContextProvider>
  )
}

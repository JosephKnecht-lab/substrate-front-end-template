import React, { createRef } from 'react'
import { Dimmer, Loader, Grid, Message } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import { Box, Container } from '@mui/material'
import { ThemeProvider, Grid as MUIGrid } from '@mui/material'
import {
  useThemeContext,
  ThemeContextProvider,
} from './theme/ThemeContextProvider'

import { SubstrateContextProvider, useSubstrateState } from './substrate-lib'
import { DeveloperConsole } from './substrate-lib/components'

import AccountSelector from './AccountSelector'
import Balances from './Balances'
import BlockNumber from './BlockNumber'
import Events from './Events'
import Interactor from './Interactor'
import Metadata from './Metadata'
import NodeInfo from './NodeInfo'
import TemplateModule from './TemplateModule'
import Transfer from './Transfer'
import Upgrade from './Upgrade'

function Main() {
  const { apiState, apiError, keyringState } = useSubstrateState()
  const { theme, mode } = useThemeContext()

  console.log('mode', mode)

  const loader = text => (
    <Dimmer active>
      <Loader size="small">{text}</Loader>
    </Dimmer>
  )

  const message = errObj => (
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message
          negative
          compact
          floating
          header="Error Connecting to Substrate"
          content={`Connection to websocket '${errObj.target.url}' failed.`}
        />
      </Grid.Column>
    </Grid>
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
    <div ref={contextRef}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            backgroundColor: mode === 'dark' ? '#2d292d' : '#f8f7f7',
            minHeight: '100vh',
            my: 0,
            width: '100%',
          }}
        >
          <Container maxWidth="xl" sx={{ minHeight: '100vh', flexGrow: 1 }}>
            <AccountSelector />
            <Grid stackable columns="equal">
              <MUIGrid container spacing={2} sx={{ mt: '35px' }}>
                <NodeInfo />
                <Metadata />
                <BlockNumber />
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

              <Grid.Row>
                <TemplateModule />
              </Grid.Row>
            </Grid>
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

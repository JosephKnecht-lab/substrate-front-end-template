import React, { useEffect, useState } from 'react'
import { useSubstrateState } from './substrate-lib/index.tsx'
import { TxButton } from './substrate-lib/components/index.tsx'
import {
  Box,
  Card,
  CardContent,
  Grid,
  OutlinedInput,
  Typography,
} from '@mui/material'
import { useThemeContext } from './theme/ThemeContextProvider.tsx'

function Main() {
  const { api } = useSubstrateState()

  // The transaction submission status
  const [status, setStatus] = useState<string>('')

  // The currently stored value
  const [currentValue, setCurrentValue] = useState<string | number>(0)
  const [formValue, setFormValue] = useState<number>(0)

  useEffect(() => {
    let unsubscribe: any
    api?.query.templateModule
      .something((newValue: any) => {
        // The storage value is an Option<u32>
        // So we have to check whether it is None first
        // There is also unwrapOr
        if (newValue.isNone) {
          setCurrentValue('<None>')
        } else {
          setCurrentValue(newValue.unwrap().toNumber())
        }
      })
      .then(unsub => {
        unsubscribe = unsub
      })
      .catch(console.error)

    return () => unsubscribe && unsubscribe()
  }, [api?.query.templateModule])

  const { mode } = useThemeContext()

  return (
    <Grid xs={6} item>
      <Typography
        color={mode === 'light' ? '#3f3f3f' : '#b8b3b9'}
        fontSize={'26px'}
        fontWeight={'600'}
        sx={{ mb: '10px' }}
      >
        Template Module
      </Typography>
      <Card
        elevation={0}
        sx={{
          borderRadius: '5px',
          boxShadow:
            mode === 'light'
              ? '0px 3px 1px -2px #ededed, 0px 2px 2px 0px #ededed, 0px 1px 5px 0px #ededed'
              : 'none',
          '& .MuiCardContent-root:last-child': {
            paddingBottom: 1.3,
          },
        }}
      >
        <CardContent sx={{ pt: 1.6, px: 2.8 }}>
          <Typography
            fontWeight={'600'}
            sx={{
              fontSize: '24px',
              letterSpacing: 0.2,
              // color: '#283244',
              lineHeight: '140%',
            }}
          >
            Current Value
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              letterSpacing: 0.5,
              color: '#949aa0',
            }}
          >
            {currentValue}
          </Typography>
        </CardContent>
      </Card>

      <form>
        <OutlinedInput
          label="New Value"
          type="number"
          onChange={e => setFormValue(+e.target.value)}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TxButton
            label="Store Something"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'templateModule',
              callable: 'doSomething',
              inputParams: [formValue],
              paramFields: [true],
            }}
          />
        </Box>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </form>
    </Grid>
  )
}

export default function TemplateModule() {
  const { api } = useSubstrateState()
  return api?.query.templateModule && api?.query.templateModule.something ? (
    <Main />
  ) : null
}

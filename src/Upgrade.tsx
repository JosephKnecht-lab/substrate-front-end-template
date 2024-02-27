import React, { ChangeEvent, useState } from 'react'
import { TxButton } from './substrate-lib/components/index.tsx'
import { Box, InputAdornment, TextField, Typography } from '@mui/material'
import { useThemeContext } from './theme/ThemeContextProvider.tsx'

export default function Main() {
  const [status, setStatus] = useState<string>('')
  const [proposal, setProposal] = useState<string>('')

  const bufferToHex = (buffer: ArrayBuffer) => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  const handleFileChosen = (file: File) => {
    const fileReader = new FileReader()
    fileReader.onloadend = e => {
      const content = bufferToHex(fileReader.result as ArrayBuffer)
      setProposal(`0x${content}`)
    }

    fileReader.readAsArrayBuffer(file)
  }

  const { mode } = useThemeContext()

  return (
    <Box>
      <Typography
        fontSize={'26px'}
        fontWeight={'600'}
        sx={{ mb: '20px' }}
        color={mode === 'light' ? '#3f3f3f' : '#b8b3b9'}
      >
        Upgrade Runtime
      </Typography>
      <form>
        <TextField
          type="file"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleFileChosen(e.target.files![0])
          }
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: '5px',
            backgroundColor: 'primary.main',
            marginTop: '20px',
            '& .MuiFilledInput-input': {
              backgroundColor: '#fff',
              borderTopRightRadius: '3px',
              borderBottomRightRadius: '3px',
              paddingLeft: '15px',
              paddingTop: '15px',
              paddingBottom: '10px',
              height: '27px',
            },
          }}
          InputProps={{
            disableUnderline: true,
            inputProps: {
              style: {
                background: mode === 'light' ? '#fff' : '#383438',
                color: mode === 'light' ? '#555555' : '#938e94',
              },
            },
            startAdornment: (
              <InputAdornment
                position="start"
                sx={{
                  px: '4px',
                  py: '0px',
                }}
              >
                <Typography
                  variant="body2"
                  component={'p'}
                  color={'#fff'}
                  sx={{
                    fontWeight: '600',
                    fontSize: '14px',
                    mr: '5px',
                    mt: '-15px',
                  }}
                >
                  WASM File
                </Typography>
              </InputAdornment>
            ),
          }}
        />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: '20px',
          }}
        >
          <TxButton
            label="Upgrade"
            type="UNCHECKED-SUDO-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'system',
              callable: 'setCode',
              inputParams: [proposal],
              paramFields: [true],
            }}
          />
        </Box>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </form>
    </Box>
  )
}

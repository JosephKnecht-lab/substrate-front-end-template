import React, { useEffect, useState } from 'react'

import { useSubstrateState } from './substrate-lib/index.tsx'
import { TxButton, TxGroupButton } from './substrate-lib/components/index.tsx'
import {
  Box,
  FormControl,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material'
import { KeyboardArrowDown } from '@mui/icons-material'
import { useThemeContext } from './theme/ThemeContextProvider.tsx'
import { makeStyles } from '@material-ui/core'
import { ApiPromise } from '@polkadot/api'

const argIsOptional = (arg: any) => arg.type.toString().startsWith('Option<')

interface FormState {
  palletRpc: string
  callable: string
  inputParams: Array<{ type: string; value: string }>
}

function Main() {
  const { api, jsonrpc } = useSubstrateState()
  const [status, setStatus] = useState<string | null>(null)

  const [interxType, setInterxType] = useState<string>('EXTRINSIC')
  const [palletRPCs, setPalletRPCs] = useState<
    Array<{ key: string; value: string; text: string }>
  >([])
  const [callables, setCallables] = useState<
    Array<{ key: string; value: string; text: string }>
  >([])
  const [paramFields, setParamFields] = useState<
    Array<{ name: string; type: string; optional: boolean }>
  >([])
  const [palletDropdownLabel, setPalletDropdownLabel] = useState<string>('')
  const [callableDropdownLabel, setCallableDropdownLabel] = useState<string>('')

  const initFormState: FormState = {
    palletRpc: '',
    callable: '',
    inputParams: [],
  }

  const [formState, setFormState] = useState(initFormState)
  const { palletRpc, callable, inputParams } = formState

  const getApiType = (api: ApiPromise, interxType: string) => {
    if (interxType === 'QUERY') {
      return api.query
    } else if (interxType === 'EXTRINSIC') {
      return api.tx
    } else if (interxType === 'RPC') {
      return api.rpc
    } else {
      return api.consts
    }
  }

  const updatePalletRPCs = () => {
    if (!api) {
      return
    }
    const apiType = getApiType(api, interxType) as Record<string, any>
    const palletRPCs = Object.keys(apiType)
      .sort()
      .filter(pr => Object.keys(apiType[pr]).length > 0)
      .map(pr => ({ key: pr, value: pr, text: pr }))
    setPalletRPCs(palletRPCs)
  }

  const updateCallables = () => {
    if (!api || palletRpc === '') {
      return
    }
    const callables = Object.keys(
      (getApiType(api, interxType) as any)[palletRpc]
    )
      .sort()
      .map(c => ({ key: c, value: c, text: c }))
    setCallables(callables)
  }

  const updateParamFields = () => {
    if (!api || palletRpc === '' || callable === '') {
      setParamFields([])
      return
    }

    let paramFields = []

    if (interxType === 'QUERY') {
      // @ts-ignore
      const metaType = api.query[palletRpc][callable]?.meta.type
      if (metaType.isPlain) {
        // Do nothing as `paramFields` is already set to []
      } else if (metaType.isMap) {
        paramFields = [
          {
            name: metaType.asMap.key.toString(),
            type: metaType.asMap.key.toString(),
            optional: false,
          },
        ]
      } else if (metaType.isDoubleMap) {
        paramFields = [
          {
            name: metaType.asDoubleMap.key1.toString(),
            type: metaType.asDoubleMap.key1.toString(),
            optional: false,
          },
          {
            name: metaType.asDoubleMap.key2.toString(),
            type: metaType.asDoubleMap.key2.toString(),
            optional: false,
          },
        ]
      }
    } else if (interxType === 'EXTRINSIC') {
      const metaArgs = api?.tx?.[palletRpc]?.[callable]?.meta?.args

      if (metaArgs && metaArgs.length > 0) {
        paramFields = metaArgs.map(arg => ({
          name: arg.name.toString(),
          type: arg.type.toString(),
          optional: argIsOptional(arg),
        }))
      }
    } else if (interxType === 'RPC') {
      let metaParam = []

      if (jsonrpc[palletRpc] && jsonrpc[palletRpc][callable]) {
        metaParam = jsonrpc[palletRpc][callable].params
      }

      if (metaParam.length > 0) {
        paramFields = metaParam.map((arg: any) => ({
          name: arg.name,
          type: arg.type,
          optional: arg.isOptional || false,
        }))
      }
    } else if (interxType === 'CONSTANT') {
      paramFields = []
    }

    setParamFields(paramFields)
  }

  useEffect(updatePalletRPCs, [api, interxType])
  useEffect(updateCallables, [api, interxType, palletRpc])
  useEffect(updateParamFields, [api, interxType, palletRpc, callable, jsonrpc])

  const onPalletCallableParamChange = (
    _:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>,
    data: any
  ) => {
    setFormState((formState: any) => {
      let res
      const { state, value } = data
      if (typeof state === 'object') {
        // Input parameter updated
        const {
          ind,
          paramField: { type },
        } = state
        const inputParams = [...formState.inputParams]
        inputParams[ind] = { type, value }
        res = { ...formState, inputParams }
      } else if (state === 'palletRpc') {
        res = { ...formState, [state]: value, callable: '', inputParams: [] }
      } else if (state === 'callable') {
        res = { ...formState, [state]: value, inputParams: [] }
      }
      return res
    })
  }

  const onInterxTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterxType(e.target.value)
    // clear the formState
    setFormState(initFormState)
  }

  const { mode } = useThemeContext()

  const useStyles = makeStyles({
    input: {
      '& .MuiFilledInput-input': {
        paddingLeft: '15px',
        paddingTop: '15px',
        paddingBottom: '10px',
        height: '24px',
        borderRadius: '0px',
      },
    },
  })

  const classes = useStyles()

  return (
    <Box sx={{ mt: '30px' }}>
      <Typography
        color={mode === 'light' ? '#3f3f3f' : '#b8b3b9'}
        fontSize={'26px'}
        fontWeight={'600'}
        sx={{ mb: '10px' }}
      >
        Pallet Interactor
      </Typography>
      <form>
        <FormControl component="fieldset" style={{ overflowX: 'auto' }}>
          <Typography
            sx={{ fontSize: '16px', my: 0.5 }}
            color={mode === 'light' ? '#555555' : '#938e94'}
          >
            Interaction Type
          </Typography>
          <RadioGroup
            row
            name="interxType"
            value={interxType}
            onChange={onInterxTypeChange}
          >
            <FormControlLabel
              value="EXTRINSIC"
              label={
                <Typography
                  sx={{ fontSize: '12px' }}
                  color={mode === 'light' ? '#555555' : '#938e94'}
                >
                  Extrinsic
                </Typography>
              }
              control={<Radio />}
            />
            <FormControlLabel
              label={
                <Typography
                  sx={{ fontSize: '12px' }}
                  color={mode === 'light' ? '#555555' : '#938e94'}
                >
                  Query
                </Typography>
              }
              value="QUERY"
              control={<Radio />}
            />
            <FormControlLabel
              value="RPC"
              control={<Radio />}
              label={
                <Typography
                  sx={{ fontSize: '12px' }}
                  color={mode === 'light' ? '#555555' : '#938e94'}
                >
                  RPC
                </Typography>
              }
            />
            <FormControlLabel
              color={mode === 'light' ? '#555555' : '#938e94'}
              value="CONSTANT"
              control={<Radio />}
              label={
                <Typography
                  sx={{ fontSize: '12px' }}
                  color={mode === 'light' ? '#555555' : '#938e94'}
                >
                  Constant
                </Typography>
              }
            />
          </RadioGroup>
        </FormControl>

        <Select
          sx={{
            mt: '10px',
            width: '100%',
            backgroundColor: mode === 'light' ? '#fff' : '#383438',
            border: 'none',
            outline: 'none',
            borderRadius: '5px',
            '& .MuiSelect-icon': {
              color: '#ddd',
            },
            '.MuiOutlinedInput-notchedOutline': { border: 0 },
          }}
          IconComponent={KeyboardArrowDown}
          displayEmpty
          value={palletDropdownLabel}
          onChange={e => {
            setPalletDropdownLabel(e.target.value)
            onPalletCallableParamChange(e, {
              state: 'palletRpc',
              value: e.target.value,
            })
          }}
        >
          <MenuItem value="" disabled>
            Pallets / RPC
          </MenuItem>
          {palletRPCs.map(rp => (
            <MenuItem value={rp.value}>{rp.text}</MenuItem>
          ))}
        </Select>
        <Select
          sx={{
            mt: '10px',
            mb: '15px',
            width: '100%',
            backgroundColor: mode === 'light' ? '#fff' : '#383438',
            border: 'none',
            outline: 'none',
            borderRadius: '5px',
            '& .MuiSelect-icon': {
              color: '#ddd',
            },
            '.MuiOutlinedInput-notchedOutline': { border: 0 },
          }}
          IconComponent={KeyboardArrowDown}
          displayEmpty
          value={callableDropdownLabel}
          onChange={e => {
            setCallableDropdownLabel(e.target.value)
            onPalletCallableParamChange(e, {
              state: 'callable',
              value: e.target.value,
            })
          }}
        >
          <MenuItem value="" disabled>
            Callables
          </MenuItem>
          {callables.map(c => (
            <MenuItem value={c.value}>{c.text}</MenuItem>
          ))}
        </Select>

        {paramFields.map((paramField, ind) => (
          <>
            <TextField
              type="text"
              value={inputParams[ind] ? inputParams[ind].value : ''}
              onChange={e =>
                onPalletCallableParamChange(e, {
                  state: { ind, paramField },
                  value: e.target.value,
                })
              }
              variant="filled"
              sx={{
                width: '100%',
                backgroundColor: 'primary.main',
                mt: '10px',
                mb: '15px',
              }}
              className={classes.input}
              placeholder={paramField.type}
              InputProps={{
                disableUnderline: true,
                inputProps: {
                  style: {
                    background: mode === 'light' ? '#fff' : '#383438',
                    color: mode === 'light' ? '#555555' : '#938e94',
                    borderRadius: '0px',
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
                        mt: '-15px',
                        mr: '5px',
                      }}
                    >
                      {paramField.name}
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </>
        ))}

        <InteractorSubmit
          setStatus={setStatus}
          attrs={{
            interxType,
            palletRpc,
            callable,
            inputParams,
            paramFields,
          }}
        />
        <div style={{ overflowWrap: 'break-word', marginTop: '1rem' }}>
          {status}
        </div>
      </form>
    </Box>
  )
}

function InteractorSubmit(props: any) {
  const {
    attrs: { interxType },
  } = props
  if (interxType === 'QUERY') {
    return <TxButton label="Query" type="QUERY" color="primary" {...props} />
  } else if (interxType === 'EXTRINSIC') {
    return <TxGroupButton {...props} />
  } else if (interxType === 'RPC' || interxType === 'CONSTANT') {
    return (
      <TxButton label="Submit" type={interxType} color="primary" {...props} />
    )
  } else {
    return (
      <TxButton label="Submit" type={interxType} color="primary" {...props} />
    )
  }
}

export default function Interactor(props: any) {
  const { api } = useSubstrateState()
  return api?.tx ? <Main {...props} /> : null
}

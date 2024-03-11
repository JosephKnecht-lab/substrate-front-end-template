import React, { useState, useEffect } from 'react'
import Switch from '@mui/material/Switch'
import { useThemeContext } from './theme/ThemeContextProvider.tsx'

import { useSubstrate, useSubstrateState } from './substrate-lib/index.tsx'
import {
  Avatar,
  Box,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import {
  Money,
  SupervisedUserCircleOutlined,
} from '@mui/icons-material'

interface KeyRingOptionProps {
  key: string
  value: string
  text: string
  icon: string
}

const CHROME_EXT_URL =
  'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd'
const FIREFOX_ADDON_URL =
  'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/'

const acctAddr = (acct: any) => (acct ? acct.address : '')

function Main() {
  const {
    setCurrentAccount,
    state: { keyring, currentAccount },
  } = useSubstrate()

  // Get the list of accounts we possess the private key for
  const keyringOptions: KeyRingOptionProps[] = keyring
    .getPairs()
    .map((account: any) => ({
      key: account.address,
      value: account.address,
      text: account.meta.name.toUpperCase(),
      icon: 'user',
    }))

  const initialAddress =
    keyringOptions.length > 0 ? keyringOptions[0].value : ''

  // Set the initial address
  useEffect(() => {
    // `setCurrentAccount()` is called only when currentAccount is null (uninitialized)
    !currentAccount &&
      initialAddress.length > 0 &&
      setCurrentAccount(keyring.getPair(initialAddress))
  }, [currentAccount, setCurrentAccount, keyring, initialAddress])

  const onChange = (addr: string) => {
    setCurrentAccount(keyring.getPair(addr))
  }

  // const { theme, toggleColorMode } = useThemeContext()
  const { toggleColorMode, mode } = useThemeContext()

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '6vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <img
        src={`${process.env.PUBLIC_URL}/assets/substrate-logo.png`}
        alt="Logo"
        width={30}
        height={40}
        style={{
          width: '40px',
          height: '40px',
          objectFit: 'contain',
          filter: mode === 'light' ? 'invert(0)' : 'invert(1)',
        }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {!currentAccount && (
          <Typography
            variant="body2"
            component={'span'}
            color={mode === 'light' ? '#3f3f3f' : '#b8b3b9'}
          >
            Create an account with Polkadot js extension{' '}
            <span>
              <a
                href={CHROME_EXT_URL}
                style={{ color: '#81bfe9', textDecoration: 'none' }}
              >
                {'(Chrome,'}
              </a>
            </span>
            <span>
              <a
                href={FIREFOX_ADDON_URL}
                style={{ color: '#81bfe9', textDecoration: 'none' }}
              >
                {'FireFox)'}
              </a>
            </span>
          </Typography>
        )}

        <Switch onClick={toggleColorMode} name="loading" color="primary" />

        <BalanceAnnotation />

        {currentAccount && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              sx={{
                fontSize: '13px',
                py: 0,
                px: 0,
                borderRadius: '50px',
              }}
              value={acctAddr(currentAccount)}
              onChange={(event: any) => {
                onChange(event.target.value)
              }}
            >
              {keyringOptions.map((option, index) => (
                <MenuItem
                  sx={{
                    fontSize: '13px',
                  }}
                  key={index}
                  value={option.value}
                >
                  {option.text}
                </MenuItem>
              ))}
            </Select>
            <Avatar
              alt="Rayyaan"
              sx={{
                backgroundColor: 'primary.main',
                width: '40px',
                height: '40px',
                fontSize: '16px',
              }}
            >
              <SupervisedUserCircleOutlined />
            </Avatar>
          </Box>
        )}
      </Box>
    </Box>
 
  )
}

function BalanceAnnotation() {
  const { api, currentAccount } = useSubstrateState()
  const [accountBalance, setAccountBalance] = useState(0)

  // When account address changes, update subscriptions
  useEffect(() => {
    let unsubscribe: any

    // If the user has selected an address, create a new subscription
    currentAccount &&
      api?.query.system
        .account(acctAddr(currentAccount), (balance: any) =>
          setAccountBalance(balance.data.free.toHuman())
        )
        .then(unsub => (unsubscribe = unsub))
        .catch(console.error)

    return () => unsubscribe && unsubscribe()
  }, [api, currentAccount])

  return currentAccount ? (
    <Box
      sx={{
        px: 1.3,
        py: 0.6,
        borderRadius: '8px',
        bgcolor: '#dad9d990',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <Money color="success" />
      {accountBalance}
    </Box>
  ) : null
}

export default function AccountSelector() {
  const { api, keyring } = useSubstrateState()
  return keyring.getPairs && api?.query ? <Main /> : null
}

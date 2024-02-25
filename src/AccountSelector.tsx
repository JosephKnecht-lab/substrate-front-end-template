import React, { useState, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { Icon, Label } from 'semantic-ui-react'

import Switch from '@mui/material/Switch'
import { useThemeContext } from './theme/ThemeContextProvider.tsx'

import { useSubstrate, useSubstrateState } from './substrate-lib/index.tsx'
import {
  Avatar,
  Box,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import {
  Apps,
  Notifications,
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
        minHeight: '8vh',
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

        <IconButton sx={{ p: 0.2 }}>
          <Notifications sx={{ color: '#899fb5' }} />
        </IconButton>
        <CopyToClipboard text={acctAddr(currentAccount)}>
          <IconButton sx={{ p: 0.2 }}>
            <Apps sx={{ color: '#899fb5' }} />
          </IconButton>
        </CopyToClipboard>
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

    // <Menu
    //   attached="top"
    //   tabular
    //   style={{
    //     backgroundColor: '#f2f3f8',
    //     borderColor: '#fff',
    //     paddingTop: '1em',
    //     paddingBottom: '1em',
    //   }}
    // >
    //   <Container>
    //     <Menu.Menu>
    //       <Image
    //         src={`${process.env.PUBLIC_URL}/assets/substrate-logo.png`}
    //         size="mini"
    //       />
    //     </Menu.Menu>
    //     <Menu.Menu position="right" style={{ alignItems: 'center' }}>
    //       {!currentAccount ? (
    //         <span>
    //           Create an account with Polkadot-JS Extension (
    //           <a target="_blank" rel="noreferrer" href={CHROME_EXT_URL}>
    //             Chrome
    //           </a>
    //           ,&nbsp;
    //           <a target="_blank" rel="noreferrer" href={FIREFOX_ADDON_URL}>
    //             Firefox
    //           </a>
    //           )&nbsp;
    //         </span>
    //       ) : null}
    //       <CopyToClipboard text={acctAddr(currentAccount)}>
    //         <Button
    //           basic
    //           circular
    //           size="large"
    //           icon="user"
    //           color={currentAccount ? 'green' : 'red'}
    //         />
    //       </CopyToClipboard>
    //       <Switch onClick={toggleColorMode} name="loading" color="primary" />
    //       <Dropdown
    //         search
    //         selection
    //         clearable
    //         placeholder="Select an account"
    //         options={keyringOptions}
    //         onChange={(_, dropdown) => {
    //           onChange(dropdown.value)
    //         }}
    //         value={acctAddr(currentAccount)}
    //       />
    //       <BalanceAnnotation />
    //     </Menu.Menu>
    //   </Container>
    // </Menu>
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
    <Label pointing="left">
      <Icon name="money" color="green" />
      {accountBalance}
    </Label>
  ) : null
}

export default function AccountSelector() {
  const { api, keyring } = useSubstrateState()
  return keyring.getPairs && api?.query ? <Main /> : null
}

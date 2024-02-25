import React, { useState, useEffect } from 'react'
// import { CopyToClipboard } from 'react-copy-to-clipboard'

import { Icon, Label } from 'semantic-ui-react'

import Switch from '@mui/material/Switch'
import { useThemeContext } from './theme/ThemeContextProvider'

import { useSubstrate, useSubstrateState } from './substrate-lib'
import { Avatar, Box, IconButton, Typography } from '@mui/material'
import { Apps, Notifications } from '@mui/icons-material'

const CHROME_EXT_URL =
  'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd'
const FIREFOX_ADDON_URL =
  'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/'

const acctAddr = acct => (acct ? acct.address : '')

function Main(props) {
  const {
    setCurrentAccount,
    state: { keyring, currentAccount },
  } = useSubstrate()

  // Get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map(account => ({
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

  // const onChange = addr => {
  //   setCurrentAccount(keyring.getPair(addr))
  // }

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
          <Typography variant="body2" component={'span'}>
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
        <IconButton sx={{ p: 0.2 }}>
          <Apps sx={{ color: '#899fb5' }} />
        </IconButton>
        <BalanceAnnotation />

        <Box
          sx={{
            px: 1.5,
            py: 1,
            border: '1px solid #d8dfe9',
            borderRadius: '50px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Typography
            variant="body2"
            component={'span'}
            sx={{ color: '#5f7485', fontWeight: '600', fontSize: '12px' }}
          >
            User PolkaDot
          </Typography>
          <Avatar
            alt="Rayyaan"
            sx={{
              backgroundColor: 'Highlight',
              width: '26px',
              height: '26px',
              fontSize: '16px',
            }}
          >
            R
          </Avatar>
        </Box>
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

function BalanceAnnotation(props) {
  const { api, currentAccount } = useSubstrateState()
  const [accountBalance, setAccountBalance] = useState(0)

  // When account address changes, update subscriptions
  useEffect(() => {
    let unsubscribe

    // If the user has selected an address, create a new subscription
    currentAccount &&
      api.query.system
        .account(acctAddr(currentAccount), balance =>
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

export default function AccountSelector(props) {
  const { api, keyring } = useSubstrateState()
  return keyring.getPairs && api.query ? <Main {...props} /> : null
}

import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  Grid,
  Container,
  Avatar,
  ListItemIcon,
  ListItemText,
  ListItem,
  ListItemAvatar,
  Divider,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useSubstrate, useSubstrateState } from './substrate-lib';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoneyIcon from '@mui/icons-material/Money';

const CHROME_EXT_URL = 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd';
const FIREFOX_ADDON_URL = 'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/';

const acctAddr = (acct) => (acct ? acct.address : '');

function Main(props) {
  const {
    setCurrentAccount,
    state: { keyring, currentAccount },
  } = useSubstrate();

  const keyringOptions = keyring.getPairs().map((account) => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase(),
  }));

  const initialAddress = keyringOptions.length > 0 ? keyringOptions[0].value : '';

  useEffect(() => {
    !currentAccount && initialAddress.length > 0 && setCurrentAccount(keyring.getPair(initialAddress));
  }, [currentAccount, setCurrentAccount, keyring, initialAddress]);

  const onChange = (event) => {
    setCurrentAccount(keyring.getPair(event.target.value));
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#E6007A', color: '#000', boxShadow: 'none' }}>
      <Container maxWidth="lg">
        <Toolbar>
          <Grid container justifyContent="flex-start" alignItems="center" spacing={2}>
            <Grid item>
              <img src={`${process.env.PUBLIC_URL}/assets/substrate-logo.png`} alt="logo" style={{ width: '32px' }} />
            </Grid>
            <Grid item>
              {!currentAccount ? (
                <Typography variant="body2">
                  Create an account with Polkadot-JS Extension (
                  <IconButton href={CHROME_EXT_URL} target="_blank" rel="noreferrer">
                    Chrome
                  </IconButton>
                  ,
                  <IconButton href={FIREFOX_ADDON_URL} target="_blank" rel="noreferrer">
                    Firefox
                  </IconButton>
                  )
                </Typography>
              ) : null}
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-end" alignItems="center" spacing={2}>
            <Grid item>
              <CopyToClipboard text={acctAddr(currentAccount)}>
                <IconButton color={currentAccount ? 'success' : 'error'} size="large">
                  <AccountCircleIcon />
                </IconButton>
              </CopyToClipboard>
            </Grid>
            <Grid item>
              <FormControl variant="outlined" fullWidth style={{ width: '200px' }}>
                <InputLabel>Select an account</InputLabel>
                <Select
                  value={acctAddr(currentAccount)}
                  onChange={onChange}
                  label="Select an account"
                  style={{ minWidth: '200px' }}
                >
                  {keyringOptions.map((option) => (
                    <MenuItem key={option.key} value={option.value}>
                      {option.text}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <BalanceAnnotation />
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

function BalanceAnnotation(props) {
  const { api, currentAccount } = useSubstrateState();
  const [accountBalance, setAccountBalance] = useState(0);

  useEffect(() => {
    let unsubscribe;

    currentAccount &&
      api.query.system
        .account(acctAddr(currentAccount), (balance) => setAccountBalance(balance.data.free.toHuman()))
        .then((unsub) => (unsubscribe = unsub))
        .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api, currentAccount]);

  return currentAccount ? (
    <ListItem alignItems="center" disableGutters>
      <ListItemAvatar>
        <Avatar>
          <MoneyIcon color="success" />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={accountBalance} />
    </ListItem>
  ) : null;
}

export default function AccountSelector(props) {
  const { keyring, api } = useSubstrateState();
  return keyring.getPairs && api.query ? <Main {...props} /> : null;
}

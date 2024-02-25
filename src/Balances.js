import React, { useEffect, useState } from 'react'
import { Label } from 'semantic-ui-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useSubstrateState } from './substrate-lib'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
} from '@mui/material'
import { makeStyles } from '@material-ui/core/styles'
import { FileCopy } from '@mui/icons-material'
import { useThemeContext } from './theme/ThemeContextProvider'

export default function Main(props) {
  const { api, keyring } = useSubstrateState()
  const accounts = keyring.getPairs()
  const [balances, setBalances] = useState({})

  const { mode } = useThemeContext()

  const useStyles = makeStyles({
    table: {
      '& td': {
        border: '1.5px solid #d8dfe9',
      },
      '& tr:nth-of-type(even)': {
        backgroundColor: mode === 'light' ? '#f6f6f8' : '#2d292d',
      },
    },
    paper: {
      border: '1px solid #d8dfe9',
      boxShadow: 'none',
    },
  })

  const classes = useStyles()

  useEffect(() => {
    const addresses = keyring.getPairs().map(account => account.address)
    let unsubscribeAll = null

    api.query.system.account
      .multi(addresses, balances => {
        const balancesMap = addresses.reduce(
          (acc, address, index) => ({
            ...acc,
            [address]: balances[index].data.free.toHuman(),
          }),
          {}
        )
        setBalances(balancesMap)
      })
      .then(unsub => {
        unsubscribeAll = unsub
      })
      .catch(console.error)

    return () => unsubscribeAll && unsubscribeAll()
  }, [api, keyring, setBalances])

  return (
    <Box sx={{ mt: 10, width: '100%' }}>
      <Typography
        color={mode === 'light' ? '#3f3f3f' : '#b8b3b9'}
        fontSize={'26px'}
        fontWeight={'600'}
      >
        Balances
      </Typography>
      {accounts.length === 0 ? (
        <Label basic color="yellow">
          No accounts to be shown
        </Label>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ mt: '26px', width: '100%' }}
          className={classes.paper}
          elevation={0}
        >
          <Table size="medium" className={classes.table}>
            <TableBody>
              <TableRow>
                <TableCell align="right" sx={{ fontSize: '20px' }}>
                  <strong>Name</strong>
                </TableCell>
                <TableCell sx={{ fontSize: '20px' }}>
                  <strong>Address</strong>
                </TableCell>
                <TableCell sx={{ fontSize: '20px' }}>
                  <strong>Balance</strong>
                </TableCell>
              </TableRow>
              {accounts.map(account => (
                <TableRow key={account.address}>
                  <TableCell align="right" sx={{ fontWeight: '600' }}>
                    {account.meta.name}
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        display: 'inline-block',
                        minWidth: '31em',
                        fontWeight: '600',
                      }}
                    >
                      {account.address}
                    </span>
                    <CopyToClipboard text={account.address}>
                      <IconButton sx={{ ml: 4 }}>
                        <FileCopy color="primary" fontSize="small" />
                      </IconButton>
                    </CopyToClipboard>
                  </TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>
                    {balances &&
                      balances[account.address] &&
                      balances[account.address]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}

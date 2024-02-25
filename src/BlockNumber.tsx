import React, { useEffect, useState } from 'react'

import { useSubstrateState } from './substrate-lib/index.tsx'
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material'
import { Timer } from '@mui/icons-material'
import { useThemeContext } from './theme/ThemeContextProvider.tsx'
import { VoidFn } from '@polkadot/api/types'

interface MainProps {
  finalized: boolean
}

const Main: React.FC<MainProps> = props => {
  const { api } = useSubstrateState()
  const { finalized } = props
  const [blockNumber, setBlockNumber] = useState<string | number>(0)
  const [blockNumberTimer, setBlockNumberTimer] = useState<number>(0)

  const bestNumber = finalized
    ? api?.derive.chain.bestNumberFinalized
    : api?.derive.chain.bestNumber

  useEffect(() => {
    let unsubscribeAll: VoidFn

    if (bestNumber) {
      bestNumber(number => {
        // Append `.toLocaleString('en-US')` to display a nice thousand-separated digit.
        setBlockNumber(number.toNumber().toLocaleString('en-US'))
        setBlockNumberTimer(0)
      })
        .then(unsub => {
          unsubscribeAll = unsub
        })
        .catch(console.error)
    }

    return () => unsubscribeAll && unsubscribeAll()
  }, [bestNumber])

  const timer = () => {
    setBlockNumberTimer(time => time + 1)
  }

  useEffect(() => {
    const id = setInterval(timer, 1000)
    return () => clearInterval(id)
  }, [])

  const { mode } = useThemeContext()

  return (
    <Grid item xs={3}>
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
              lineHeight: '140%',
            }}
          >
            {blockNumber}
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              letterSpacing: 0.5,
              color: '#949aa0',
            }}
          >
            {(finalized ? 'Finalized' : 'Current') + ' Block'}
          </Typography>
          <Box sx={{ my: 6 }} />
        </CardContent>
        <Divider style={{ borderColor: '#ededed' }} />
        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            px: 2.2,
            pt: 1.3,
          }}
        >
          <Timer fontSize="small" sx={{ color: '#5f7485' }} />

          <Typography fontSize={'14px'}>{blockNumberTimer}</Typography>
        </CardContent>
      </Card>
    </Grid>

    // <Grid.Column>
    //   <Card>
    //     <Card.Content textAlign="center">
    //       <Statistic
    //         className="block_number"
    //         label={(finalized ? 'Finalized' : 'Current') + ' Block'}
    //         value={blockNumber}
    //       />
    //     </Card.Content>
    //     <Card.Content extra>
    //       <Icon name="time" /> {blockNumberTimer}
    //     </Card.Content>
    //   </Card>
    // </Grid.Column>
  )
}

export default function BlockNumber(props: MainProps) {
  const { api } = useSubstrateState()
  return api?.derive && api?.derive.chain ? <Main {...props} /> : null
}

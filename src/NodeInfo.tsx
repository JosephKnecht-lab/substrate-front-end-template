import React, { useEffect, useState } from 'react'

import { useSubstrateState } from './substrate-lib/index.tsx'
import { Card, CardContent, Grid, Divider, Typography } from '@mui/material'
import { Settings } from '@mui/icons-material'
import { useThemeContext } from './theme/ThemeContextProvider.tsx'

interface NodeInfoProps {
  chain?: string | undefined
  nodeName?: string
  nodeVersion?: string
}

const Main: React.FC = () => {
  const { api, socket } = useSubstrateState()
  const [nodeInfo, setNodeInfo] = useState<NodeInfoProps>({})

  useEffect(() => {
    const getInfo = async () => {
      try {
        const [chain, nodeName, nodeVersion] = await Promise.all([
          api?.rpc.system.chain(),
          api?.rpc.system.name(),
          api?.rpc.system.version(),
        ])
        setNodeInfo({
          chain: chain?.toString(),
          nodeName: nodeName?.toString(),
          nodeVersion: nodeVersion?.toString(),
        })
      } catch (e) {
        console.error(e)
      }
    }
    getInfo()
  }, [api?.rpc.system])

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
              // color: '#283244',
              lineHeight: '140%',
            }}
          >
            {nodeInfo.nodeName}
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              letterSpacing: 0.5,
              color: '#949aa0',
            }}
          >
            {nodeInfo.chain}
          </Typography>
          <Typography
            sx={{
              fontSize: '16px',
              letterSpacing: 0.2,
              fontWeight: '500',
              my: 3,
            }}
          >
            {socket}
          </Typography>
        </CardContent>
        <Divider style={{ borderColor: '#ededed' }} />
        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            px: 2.2,
            pt: 1.3,
          }}
        >
          <Settings fontSize="small" sx={{ color: '#5f7485' }} />

          <Typography fontSize={'14px'}>v{nodeInfo.nodeVersion}</Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}

const NodeInfo: React.FC = props => {
  const { api } = useSubstrateState()
  return api?.rpc && api?.rpc.system ? <Main {...props} /> : null
}

export default NodeInfo

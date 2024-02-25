import React, { useEffect, useState } from 'react'

import { useSubstrateState } from './substrate-lib'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material'
import { useThemeContext } from './theme/ThemeContextProvider'

function Main(props) {
  const { api } = useSubstrateState()
  const [metadata, setMetadata] = useState({ data: null, version: null })

  useEffect(() => {
    const getMetadata = async () => {
      try {
        const data = await api.rpc.state.getMetadata()
        setMetadata({ data, version: data.version })
      } catch (e) {
        console.error(e)
      }
    }
    getMetadata()
  }, [api.rpc.state])

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
            paddingBottom: 0.7,
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
            Metadata
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              letterSpacing: 0.5,
              color: '#949aa0',
            }}
          >
            v{metadata.version}
          </Typography>
          <Box sx={{ my: 6 }} />
        </CardContent>
        <Divider style={{ borderColor: '#ededed' }} />
        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            px: 2.2,
            pt: 0.7,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              textTransform: 'capitalize',
              py: 0.6,
              fontSize: '12px',
            }}
          >
            Show Metadata
          </Button>
        </CardContent>
      </Card>
    </Grid>
  )
}
// <Grid.Column>
//   <Card>
//     <Card.Content>
//       <Card.Header>Metadata</Card.Header>
//       <Card.Meta>
//         <span>v{metadata.version}</span>
//       </Card.Meta>
//     </Card.Content>
//     <Card.Content extra>
//       <Modal trigger={<Button>Show Metadata</Button>}>
//         <Modal.Header>Runtime Metadata</Modal.Header>
//         <Modal.Content scrolling>
//           <Modal.Description>
//             <pre>
//               <code>{JSON.stringify(metadata.data, null, 2)}</code>
//             </pre>
//           </Modal.Description>
//         </Modal.Content>
//       </Modal>
//     </Card.Content>
//   </Card>
// </Grid.Column>

export default function Metadata(props) {
  const { api } = useSubstrateState()
  return api.rpc && api.rpc.state && api.rpc.state.getMetadata ? (
    <Main {...props} />
  ) : null
}

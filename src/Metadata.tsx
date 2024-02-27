import React, { useEffect, useState } from 'react'

import { useSubstrateState } from './substrate-lib/index.tsx'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material'
import { useThemeContext } from './theme/ThemeContextProvider.tsx'
import { Metadata as MetaDataTypes } from '@polkadot/types'
import { makeStyles, Modal, Backdrop, Fade } from '@material-ui/core'

interface MetadataProps {
  data: MetaDataTypes | null
  version: number | null | undefined
}

function Main() {
  const { api } = useSubstrateState()
  const [metadata, setMetadata] = useState<MetadataProps>({
    data: null,
    version: null,
  })

  useEffect(() => {
    const getMetadata = async () => {
      try {
        const data = await api?.rpc.state.getMetadata()
        setMetadata({ data: data!, version: data?.version })
      } catch (e) {
        console.error(e)
      }
    }
    getMetadata()
  }, [api?.rpc.state])

  const { mode } = useThemeContext()

  const useStyles = makeStyles(theme => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: mode === 'dark' ? '#383438' : '#f2f3f8',
      border: '1px solid #383438',
      borderRadius: '8px',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      maxWidth: '780px',
      maxHeight: '550px',
      overflowY: 'auto',
    },
  }))

  const classes = useStyles()

  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
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
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpen}
                sx={{
                  textTransform: 'capitalize',
                  py: 0.6,
                  fontSize: '12px',
                }}
              >
                Show Metadata
              </Button>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Modal
        open={open}
        className={classes.modal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={`${classes.paper} custom-sc`}>
            <h2
              id="modal-modal-title"
              style={{ color: mode === 'dark' ? '#b8b3b9' : '#3f3f3f' }}
            >
              Runtime Metadata
            </h2>
            <pre style={{ color: mode === 'dark' ? '#b8b3b9' : '#3f3f3f' }}>
              <code>{JSON.stringify(metadata.data, null, 2)}</code>
            </pre>
          </div>
        </Fade>
      </Modal>
    </>
  )
}

export default function Metadata(props: any) {
  const { api } = useSubstrateState()
  return api?.rpc && api?.rpc.state ? <Main {...props} /> : null
}

import React, { useEffect, useState } from 'react'

import { useSubstrateState } from './substrate-lib/index.tsx'
import { Box, IconButton, Paper, Typography } from '@mui/material'
import { LayersClear } from '@mui/icons-material'
import { useThemeContext } from './theme/ThemeContextProvider.tsx'

// Events to be filtered from feed
const FILTERED_EVENTS = [
  'system:ExtrinsicSuccess::(phase={"applyExtrinsic":0})',
]

interface EventsProps {
  key: number
  icon: string
  summary: string
  content: string
}

const eventName = (ev: any) => `${ev.section}:${ev.method}`
const eventParams = (ev: any) => JSON.stringify(ev.data)

function Main() {
  const { api } = useSubstrateState()
  const [eventFeed, setEventFeed] = useState<EventsProps[]>([])

  useEffect(() => {
    let unsub: any = null
    let keyNum = 0
    const allEvents = async () => {
      unsub = await api?.query.system.events((events: any) => {
        // loop through the Vec<EventRecord>
        events.forEach((record: any) => {
          // extract the phase, event and the event types
          const { event, phase } = record

          // show what we are busy with
          const evHuman = event.toHuman()
          const evName = eventName(evHuman)
          const evParams = eventParams(evHuman)
          const evNamePhase = `${evName}::(phase=${phase.toString()})`

          if (FILTERED_EVENTS.includes(evNamePhase)) return

          setEventFeed(e => [
            {
              key: keyNum,
              icon: 'bell',
              summary: evName,
              content: evParams,
            },
            ...e,
          ])

          keyNum += 1
        })
      })
    }

    allEvents()
    return () => unsub && unsub()
  }, [api?.query.system])

  const { mode } = useThemeContext()

  return (
    <Box sx={{ mt: '20px' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          color={mode === 'light' ? '#3f3f3f' : '#b8b3b9'}
          variant="h1"
          fontSize={'26px'}
          fontWeight={'600'}
        >
          Events
        </Typography>
        <IconButton onClick={() => setEventFeed([])}>
          <LayersClear />
        </IconButton>
      </Box>
      <Box
        component={Paper}
        elevation={0}
        className="custom-sc"
        sx={{
          mt: '20px',
          // bgcolor: '#fff',
          minHeight: '350px',
          maxHeight: '350px',
          width: '100%',
          overflow: 'auto',
          px: 2.5,
          py: 3,
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {eventFeed?.map((ev, ind) => {
          return (
            <Box sx={{ borderLeft: '4px solid #add3f1', px: 1.5 }} key={ind}>
              <Typography
                fontSize={'20px'}
                color={mode === 'light' ? '#3f3f3f' : '#b8b3b9'}
                fontWeight={'600'}
                sx={{ textTransform: 'capitalize' }}
              >
                {ev.summary}
              </Typography>
              <Typography
                fontSize={'14px'}
                sx={{ mt: '-1px' }}
                color={mode === 'light' ? '#555555' : '#938e94'}
              >
                {ev.content}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default function Events() {
  const { api } = useSubstrateState()
  return api?.query && api?.query.system && api?.query.system.events ? (
    <Main />
  ) : null
}

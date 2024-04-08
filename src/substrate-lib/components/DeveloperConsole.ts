import React from 'react'
import { useSubstrateState } from '../index.tsx'
import * as util from '@polkadot/util'
import * as utilCrypto from '@polkadot/util-crypto'

const DeveloperConsole: React.FC = () => {
  const { api, apiState, keyring, keyringState } = useSubstrateState()
  if (apiState === 'READY') {
    window.api = api
  }
  if (keyringState === 'READY') {
    window.keyring = keyring
  }
  window.util = util
  window.utilCrypto = utilCrypto

  return null
}

export default DeveloperConsole

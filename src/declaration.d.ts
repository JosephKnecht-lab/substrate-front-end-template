import { ApiPromise } from '@polkadot/api'
import { Keyring } from '@polkadot/keyring'
import * as util from '@polkadot/util'
import * as utilCrypto from '@polkadot/util-crypto'

declare global {
  interface Window {
    api?: ApiPromise | null
    keyring?: Keyring
    util: typeof util
    utilCrypto: typeof utilCrypto
  }
}

import { InjectedConnector } from "@web3-react/injected-connector"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"
import { DEFAULT_NETWORK_ID } from "config/constants"
import { supportedNetworkIds, supportedNetworkURLs } from "config/network"

const POLLING_INTERVAL = 12000

const injected = new InjectedConnector({
  supportedChainIds: supportedNetworkIds,
})

const walletconnect = new WalletConnectConnector({
  rpc: { [DEFAULT_NETWORK_ID]: supportedNetworkURLs[DEFAULT_NETWORK_ID] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

export default {
  injected,
  trustwallet: injected,
  walletconnect,
}

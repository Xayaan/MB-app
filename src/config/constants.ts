import { ReactComponent as MetaMaskSVG } from "assets/svgs/wallet/metamask-color.svg"
import { ReactComponent as TrustWalletSVG } from "assets/svgs/wallet/trust-wallet.svg"
import { ReactComponent as WalletConnectSVG } from "assets/svgs/wallet/wallet-connect.svg"
import { EConnectorNames } from "types/enums"

export const STORAGE_KEY_SETTINGS = "settings"
export const STORAGE_KEY_CONNECTOR = "CONNECTOR"
export const LOGGER_ID = "MoonBear-App"

export const PRICE_DECIMALS = 18
export const ETHER_DECIMALS = 18

export const DEFAULT_NETWORK_ID = 97

export const WALLET_ICONS: { [key in EConnectorNames]: React.ElementType } = {
  [EConnectorNames.Injected]: MetaMaskSVG,
  [EConnectorNames.WalletConnect]: WalletConnectSVG,
  [EConnectorNames.TrustWallet]: TrustWalletSVG,
}

export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"

export const MAX_STAKE_DAYS = 3333
export const SHARE_MULTIPLIER_DECIMALS = 8

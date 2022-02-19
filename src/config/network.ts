import { providers } from "ethers"
import { IKnownTokenData, INetwork, IToken, KnownContracts, KnownToken, NetworkId } from "types"
import { entries } from "utils/type-utils"

import { DEFAULT_NETWORK_ID } from "./constants"

export const networkIds = {
  BSC: 56,
  BSCTEST: 97,
} as const

export const tokenIds = {
  mbf: "mbf",
  busd: "busd",
} as const

const networks: { [K in NetworkId]: INetwork } = {
  [networkIds.BSC]: {
    label: "Binance Smart Chain",
    url: "https://bsc-dataseed.binance.org/",
    contracts: {
      staking: "0x1BcA6f81036Ff9333371B56d015244B87ddB2886",
      unicrypt: "0xeaed594b5926a7d5fbbc61985390baaf936a6b8d",
      teamFinance: "0x0c89c0407775dd89b12918b9c0aa42bf96518820",
    },
    etherscanUri: "https://bscscan.com/",
    thegraph: {
      httpUri: "https://api.thegraph.com/subgraphs/name/0xlook/moonbear-subgraph",
      wsUri: "wss://api.thegraph.com/subgraphs/name/0xlook/moonbear-subgraph",
    },
  },
  [networkIds.BSCTEST]: {
    label: "BSC Testnet",
    url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    contracts: {
      staking: "0x83cCe14e9be4857D61fFeC0a96cB810f0E198726",
      unicrypt: "0xeaed594b5926a7d5fbbc61985390baaf936a6b8d",
      teamFinance: "0x0c89c0407775dd89b12918b9c0aa42bf96518820",
    },
    etherscanUri: "https://testnet.bscscan.com/",
    thegraph: {
      httpUri: "https://api.thegraph.com/subgraphs/name/0xlook/moonbear-subgraph",
      wsUri: "wss://api.thegraph.com/subgraphs/name/0xlook/moonbear-subgraph",
    },
  },
}

const knownTokens: { [K in KnownToken]: IKnownTokenData } = {
  mbf: {
    name: "MoonBear",
    symbol: "mbf",
    addresses: {
      [networkIds.BSCTEST]: "0xAF9bcF8BBaEFD9592959F334f06844513b7B61f8",
      [networkIds.BSC]: "0xe2997ae926C7a76aF782923a7fEf89f36d86C98F",
    },
    image: "",
    decimals: 18,
  },
  busd: {
    name: "Binance-Peg BUSD",
    symbol: "BUSD",
    image: "",
    addresses: {
      [networkIds.BSCTEST]: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
      [networkIds.BSC]: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    },
    decimals: 18,
  },
}

export const DefaultReadonlyProvider = new providers.JsonRpcProvider(networks[97].url, 97)

export const supportedNetworkIds = Object.keys(networks).map(Number) as NetworkId[]

export const supportedNetworkURLs = entries(networks).reduce<{
  [networkId: number]: string
}>(
  (acc, [networkId, network]) => ({
    ...acc,
    [networkId]: network.url,
  }),
  {}
)

const validNetworkId = (networkId: number): networkId is NetworkId => {
  return networks[networkId as NetworkId] !== undefined
}

export const getEtherscanUri = (networkId?: number): string => {
  const fNetworkId = networkId || DEFAULT_NETWORK_ID
  if (!validNetworkId(fNetworkId)) {
    throw new Error(`Unsupported network id: '${fNetworkId}'`)
  }

  return networks[fNetworkId].etherscanUri
}

export const getToken = (tokenId: KnownToken, networkId?: number): IToken => {
  const token = knownTokens[tokenId]

  if (!token) {
    throw new Error(`Unsupported token id: '${tokenId}'`)
  }
  const fNetworkId = networkId || DEFAULT_NETWORK_ID
  if (!validNetworkId(fNetworkId)) {
    throw new Error(`Unsupported network id: '${fNetworkId}'`)
  }
  return {
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    address: token.addresses[fNetworkId],
  }
}

export const getTokenFromAddress = (address: string, chainId?: number): IToken => {
  const networkId = chainId || DEFAULT_NETWORK_ID
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`)
  }

  for (const token of Object.values(knownTokens)) {
    const tokenAddress = token.addresses[networkId]

    // token might not be supported in the current network
    if (!tokenAddress) {
      continue
    }

    if (tokenAddress.toLowerCase() === address.toLowerCase()) {
      return {
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        address: tokenAddress,
        image: token.image,
      }
    }
  }

  throw new Error(`Couldn't find token with address '${address}' in network '${networkId}'`)
}

export const getContractAddress = (contract: KnownContracts, chainId?: number): string => {
  const networkId = chainId || DEFAULT_NETWORK_ID
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`)
  }
  return networks[networkId].contracts[contract]
}

export const getGraphUris = (chainId?: number): { httpUri: string; wsUri: string } => {
  const networkId = chainId || DEFAULT_NETWORK_ID
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`)
  }

  return networks[networkId].thegraph
}

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
  const provider = window.ethereum
  if (provider) {
    const networkId = DEFAULT_NETWORK_ID
    try {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${networkId.toString(16)}`,
            chainName: networks[DEFAULT_NETWORK_ID].label,
            nativeCurrency: {
              name: "BNB",
              symbol: "bnb",
              decimals: 18,
            },
            rpcUrls: [networks[networkId].url],
            blockExplorerUrls: [networks[networkId].etherscanUri],
          },
        ],
      })
      return true
    } catch (error) {
      alert(JSON.stringify(error))
      console.error(error)
      return false
    }
  } else {
    alert("shit")
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
    return false
  }
}

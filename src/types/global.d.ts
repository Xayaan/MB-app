import { BigNumber } from "ethers"

export type Maybe<T> = T | null

declare global {
  interface Window {
    ethereum: ExternalProvider | JsonRpcFetchFunc
  }
}
export interface ISettings {
  theme: THEME
  responsiveFontSizes: boolean
}

export interface INetwork {
  label: string
  url: string
  contracts: {
    staking: string
    unicrypt: string
    teamFinance: string
  }
  etherscanUri: string
  thegraph: {
    httpUri: string
    wsUri: string
  }
}

export type NetworkId = 56 | 97

export type KnownContracts = keyof INetwork["contracts"]

export interface IToken {
  address: string
  decimals: number
  symbol: string
  image?: string
  name: string
}

export type KnownToken = "mbf" | "busd"

export interface IKnownTokenData {
  name: string
  symbol: string
  addresses: { [key in NetworkId]: string }
  image: string
  decimals: number
}

export interface IUserStaking {
  address: string
  steps: BigNumber
  stakingId: BigNumber
  startDate: BigNumber
  unstakeDate: BigNumber
  amount: BigNumber
  shares: BigNumber
  penaltyRate: BigNumber
}

import stakingAbi from "abi/staking.json"
import { BigNumber, Contract, Wallet, ethers } from "ethers"
import { IUserStaking, Maybe } from "types"
import { ZERO } from "utils/number"

class StakingService {
  provider: any
  contract: Contract

  constructor(provider: any, signerAddress: Maybe<string>, tokenAddress: string) {
    this.provider = provider
    if (signerAddress) {
      const signer: Wallet = provider.getSigner()
      this.contract = new ethers.Contract(tokenAddress, stakingAbi, provider).connect(signer)
    } else {
      this.contract = new ethers.Contract(tokenAddress, stakingAbi, provider)
    }
  }

  get address(): string {
    return this.contract.address
  }

  mbfToken = async (): Promise<string> => {
    return this.contract.mbfToken()
  }

  totalStakes = async (): Promise<BigNumber> => {
    return this.contract.totalStakes()
  }

  totalShares = async (): Promise<BigNumber> => {
    return this.contract.totalShares()
  }

  getUserStakingCount = async (address: string): Promise<BigNumber> => {
    return this.contract.getUserStakingCount(address)
  }

  getUserStakingId = async (address: string, idx: BigNumber | number): Promise<BigNumber> => {
    return this.contract.getUserStakingId(address, idx)
  }

  getClaimableReward = async (address: string): Promise<BigNumber> => {
    return this.contract.getClaimableReward(address)
  }

  getShares = async (steps: BigNumber | number, amount: BigNumber | number): Promise<BigNumber> => {
    return this.contract.getShares(steps, amount)
  }

  getPenaltyRateWei = async (
    startDate: BigNumber | number,
    steps: BigNumber | number
  ): Promise<BigNumber> => {
    return this.contract.getPenaltyRateWei(startDate, steps)
  }

  getUserStaking = async (id: BigNumber | number): Promise<IUserStaking> => {
    const response = await this.contract.userStakingOf(id)

    return {
      address: response[0],
      steps: response[1],
      stakingId: response[2],
      startDate: response[3],
      unstakeDate: response[4],
      amount: response[5],
      shares: response[6],
      penaltyRate: ZERO,
    }
  }

  claimStableReward = async (): Promise<string> => {
    const txObject = await this.contract.claimStableReward()
    return txObject.hash
  }

  stake = async (steps: BigNumber | number, amount: BigNumber): Promise<string> => {
    const txObject = await this.contract.stake(steps, amount)
    return txObject.hash
  }

  unstake = async (id: BigNumber): Promise<string> => {
    const txObject = await this.contract.unstake(id)
    return txObject.hash
  }
}

export { StakingService }

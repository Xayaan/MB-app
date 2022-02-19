import { NULL_ADDRESS } from "config/constants"
import { useConnectedWeb3Context } from "contexts"
import { BigNumber } from "ethers"
import { useEffect, useState } from "react"
import { ERC20Service } from "services/erc20"
import { ZERO } from "utils/number"

export const useTokenBalance = (tokenAddress: string): BigNumber => {
  const [balance, setBalance] = useState(ZERO)
  const { account, library: provider, networkId } = useConnectedWeb3Context()

  useEffect(() => {
    let isMounted = true

    const loadBalance = async () => {
      if (!account || !provider || !networkId) {
        setBalance(() => ZERO)
        return
      }
      try {
        if (tokenAddress === NULL_ADDRESS) {
          // ethBalance;
          const bal = await provider.getBalance(account)
          if (isMounted) setBalance(() => bal)
        } else {
          const erc20 = new ERC20Service(provider, account, tokenAddress)
          const bal = await erc20.getBalanceOf(account)
          if (isMounted) setBalance(() => bal)
        }
      } catch (error) {
        if (isMounted) setBalance(() => ZERO)
      }
    }

    loadBalance()

    return () => {
      isMounted = false
    }
  }, [tokenAddress, account, networkId])

  return balance
}

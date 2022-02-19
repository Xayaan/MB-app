import { NULL_ADDRESS } from "config/constants"
import { DefaultReadonlyProvider, getContractAddress, getToken } from "config/network"
import { useConnectedWeb3Context } from "contexts"
import { BigNumber } from "ethers"
import { parseUnits } from "ethers/lib/utils"
import { useEffect, useState } from "react"
import { ERC20Service } from "services/erc20"
import { ZERO } from "utils/number"

export const useMBFCSupply = (): BigNumber => {
  const [supply, setSupply] = useState(ZERO)
  const { account, library: provider, networkId } = useConnectedWeb3Context()

  useEffect(() => {
    let isMounted = true

    const loadInfo = async () => {
      try {
        const mbf = getToken("mbf", networkId)
        const unicrypt = getContractAddress("unicrypt", networkId)
        const teamFinance = getContractAddress("teamFinance", networkId)
        const erc20 = new ERC20Service(provider || DefaultReadonlyProvider, account, mbf.address)

        const totalSupply = await erc20.totalSupply()
        const uniBal = await erc20.getBalanceOf(unicrypt)
        const teamBal = await erc20.getBalanceOf(teamFinance)

        if (isMounted) setSupply(() => totalSupply.sub(uniBal).sub(teamBal).mul(parseUnits("1", 9)))
      } catch (error) {
        if (isMounted) setSupply(() => ZERO)
      }
    }

    loadInfo()

    return () => {
      isMounted = false
    }
  }, [networkId])

  return supply
}

import { DefaultReadonlyProvider, getContractAddress, getGraphUris, getToken } from "config/network"
import { useConnectedWeb3Context } from "contexts"
import { BigNumber } from "ethers"
import { parseUnits } from "ethers/lib/utils"
import { useEffect, useState } from "react"
import { ERC20Service } from "services/erc20"
import { ZERO } from "utils/number"
import { fetchQuery } from "utils/thegraph"

const query = `
  query($id: ID!) {
    account(id: $id) {
      balance
    }
  }
`

export const useReflection = (): BigNumber => {
  const [reflection, setReflection] = useState(ZERO)
  const { account, library: provider, networkId } = useConnectedWeb3Context()

  useEffect(() => {
    let isMounted = true

    const loadInfo = async () => {
      if (!account || !provider) {
        setReflection(() => ZERO)
        return
      }
      try {
        const mbf = getToken("mbf", networkId)
        const erc20 = new ERC20Service(provider || DefaultReadonlyProvider, account, mbf.address)

        const balance = await erc20.getBalanceOf(account)

        const graphUri = getGraphUris(networkId).httpUri
        const response = (await fetchQuery(query, { id: account }, graphUri)).data
        if (response.data && response.data.account) {
          const oBalance = BigNumber.from(response.data.account.balance)

          console.log("==balance", balance.toString())
          console.log("==thegraph balance", oBalance.toString())
          console.log("==reflection", balance.sub(oBalance).toString())
          if (isMounted) setReflection(() => balance.sub(oBalance))
        } else {
          if (isMounted) setReflection(() => ZERO)
        }
      } catch (error) {
        if (isMounted) setReflection(() => ZERO)
      }
    }

    loadInfo()

    return () => {
      isMounted = false
    }
  }, [account, networkId])

  return reflection
}

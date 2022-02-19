import axios from "axios"
import { getToken, networkIds } from "config/network"
import { BigNumber } from "ethers"
import { parseEther } from "ethers/lib/utils"
import { useEffect, useState } from "react"
import { parseNumberToEther } from "utils"
import { ZERO } from "utils/number"

interface IState {
  price: BigNumber
}

export const useMBFPrice = () => {
  const [state, setState] = useState<IState>({ price: ZERO })

  const mbfToken = getToken("mbf", networkIds.BSC)
  const mbfTokenAddress = mbfToken.address.toLowerCase()

  useEffect(() => {
    let isMounted = true

    const loadPlayPrice = async () => {
      try {
        const response = (
          await axios.get(
            `https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain?contract_addresses=${mbfTokenAddress}&vs_currencies=usd`
          )
        ).data
        setState((prev) => ({
          ...prev,
          price: parseNumberToEther(String(response[mbfTokenAddress].usd)),
        }))
      } catch (error) {
        console.error(error)
        setState((prev) => ({ ...prev, price: ZERO }))
      }
    }

    loadPlayPrice()

    const interval = setInterval(loadPlayPrice, 60000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  return state.price
}

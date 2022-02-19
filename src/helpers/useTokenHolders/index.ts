import axios from "axios"
import { useEffect, useState } from "react"

export const useTokenHolders = () => {
  const [holders, setHolders] = useState(0)

  useEffect(() => {
    const loadHolders = async () => {
      try {
        const response = await axios.get(
          "https://api.covalenthq.com/v1/56/tokens/0xe2997ae926C7a76aF782923a7fEf89f36d86C98F/token_holders_changes/?starting-block=9696850&key=ckey_2d3971b720f447d3be738308dc4&page-size=5"
        )
        const data = response.data
        const holders = (data.data || {}).pagination.total_count
        setHolders(() => holders)
      } catch (error) {
        setHolders(() => 0)
      }
    }

    loadHolders()

    const interval = setInterval(loadHolders, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return holders
}

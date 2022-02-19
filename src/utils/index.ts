import { BigNumber, utils } from "ethers"
import { parseUnits } from "ethers/lib/utils"

const { formatUnits, parseEther } = utils

export const shortenAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

export const formatBigNumber = (value: BigNumber, decimals: number, precision = 2): string =>
  Number(formatUnits(value, decimals)).toFixed(precision)

export const hideInsignificantZeros = (x: string) => {
  const splits = x.toString().split(".")
  if (splits.length === 1) {
    return x
  }
  let right = splits[1]

  while (right.length > 0 && right.charAt(right.length - 1) === "0") {
    right = right.substr(0, right.length - 1)
  }
  if (right.length === 0) {
    return splits[0]
  }
  return [splits[0], right].join(".")
}

export const isObjectEqual = (obj1?: any, obj2?: any): boolean => {
  if (!obj1 && obj2) return false
  if (!obj2 && obj1) return false
  if (!obj1 && !obj2) return true
  if (typeof obj1 !== typeof obj2) return false

  if (typeof obj1 !== "object" && !Array.isArray(obj1)) {
    return obj1 === obj2
  }

  if (Array.isArray(obj1)) {
    for (let index = 0; index < obj1.length; index += 1) {
      if (!isObjectEqual(obj1[index], obj2[index])) return false
    }
    return true
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false

  for (let keyIndex = 0; keyIndex < keys1.length; keyIndex += 1) {
    const key = keys1[keyIndex]
    if (typeof obj1[key] !== typeof obj2[key]) return false
    if (!isObjectEqual(obj1[key], obj2[key])) return false
  }

  return true
}

export const formatToShortNumber = (number: string, decimals = 2): string => {
  if (number.length < 1) {
    return "0"
  }

  const units = ["", "K", "M", "B", "T"]
  let unitIndex = 0
  let rNumber = parseFloat(number.split(",").join(""))

  while (rNumber >= 1000 && unitIndex < 5) {
    unitIndex += 1
    rNumber = rNumber / 1000
  }

  return `${parseFloat(rNumber.toFixed(decimals))}${units[unitIndex]}`
}

export const numberWithCommas = (x: number | string) => {
  const splits = x.toString().split(".")
  const first = splits[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  if (splits.length === 1) return first
  return [first, splits[1]].join(".")
}

export const waitSeconds = (sec = 2): Promise<void> =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, sec * 1000)
  })

export const parseNumberToEther = (data: string): BigNumber => {
  const splits = data.split("e")

  if (splits.length === 1) {
    return parseEther(splits[0])
  }
  const value = parseEther(splits[0])

  const factory = parseUnits("1", parseInt(splits[1].substr(1)))

  const isDivide = splits[1].includes("-")

  return isDivide ? value.div(factory) : value.mul(factory)
}

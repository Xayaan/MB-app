import { Grid, makeStyles, Typography } from "@material-ui/core"
import clsx from "clsx"
import { ETHER_DECIMALS } from "config/constants"
import { getToken } from "config/network"
import { useConnectedWeb3Context } from "contexts"
import { useMBFPrice, useTokenHolders, useMBFCSupply, useReflection } from "helpers"
import { transparentize } from "polished"
import React from "react"
import useCommonStyles from "style/common"
import { formatBigNumber, numberWithCommas } from "utils"
import { ZERO } from "utils/number"

const useStyles = makeStyles((theme) => ({
  root: { padding: "24px 0" },
  content: {},
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: 100,
    height: 100,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: transparentize(0.6, theme.colors.fourth),
    marginTop: 12,
  },
  value: {
    fontWeight: 600,
    fontSize: 24,
    color: theme.colors.default,
  },
  label: {
    fontWeight: 200,
    fontSize: 14,
    color: theme.colors.fourth,
  },
}))

const StatsPage = () => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()

  const { networkId } = useConnectedWeb3Context()
  const mbf = getToken("mbf", networkId)
  const mbfPrice = useMBFPrice()
  const tokenHolders = useTokenHolders()
  const csupply = useMBFCSupply()
  const reflection = useReflection()
  const marketCap = csupply.mul(mbfPrice)

  const data = [
    {
      icon: "/assets/statistics/price-icon.svg",
      label: "Price",
      value: `$${formatBigNumber(mbfPrice, ETHER_DECIMALS, 8)}`,
    },
    {
      icon: "/assets/statistics/marketcap-icon.svg",
      label: "Marketcap",
      value: `$${numberWithCommas(formatBigNumber(marketCap, ETHER_DECIMALS * 2, 2))}`,
    },
    {
      icon: "/assets/statistics/staked-icon.svg",
      label: "Your Reflection",
      value: `$${numberWithCommas(
        formatBigNumber(reflection.mul(mbfPrice), mbf.decimals + ETHER_DECIMALS, 10)
      )}`,
    },
    {
      icon: "/assets/statistics/addresses-icon.svg",
      label: "Addresses",
      value: numberWithCommas(tokenHolders),
    },
  ]

  return (
    <div className={classes.root}>
      <div className={clsx(commonClasses.content, classes.content)}>
        <div>
          <Grid container spacing={3}>
            {data.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.label}>
                <div className={classes.item}>
                  <img alt="icon" className={classes.img} src={item.icon} />
                  <div className={classes.divider} />
                  <Typography className={classes.value}>{item.value}</Typography>
                  <Typography className={classes.label}>{item.label}</Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </div>
  )
}

export default StatsPage

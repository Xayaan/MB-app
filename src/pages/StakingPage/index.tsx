import { Button, Grid, makeStyles, Typography } from "@material-ui/core"
import clsx from "clsx"
import { BigNumberInput, NumberInput, RangeSlider, SectionWrapper } from "components"
import {
  ETHER_DECIMALS,
  MAX_STAKE_DAYS,
  PRICE_DECIMALS,
  SHARE_MULTIPLIER_DECIMALS,
} from "config/constants"
import { DefaultReadonlyProvider, getContractAddress, getToken } from "config/network"
import { useConnectedWeb3Context } from "contexts"
import { BigNumber } from "ethers"
import { useMBFPrice, useTokenBalance } from "helpers"
import moment from "moment"
import { transparentize } from "polished"
import React, { useEffect, useState } from "react"
import { ERC20Service } from "services/erc20"
import { StakingService } from "services/staking"
import useCommonStyles from "style/common"
import { IUserStaking } from "types"
import { numberWithCommas, hideInsignificantZeros, formatBigNumber } from "utils"
import { ZERO } from "utils/number"

const useStyles = makeStyles((theme) => ({
  root: { padding: "24px 0" },
  content: {},
  section: {
    textAlign: "center",
    height: "100%",
  },
  img: { width: 70, height: 70, marginBottom: 12 },
  label: {
    color: theme.colors.fifth,
    fontWeight: 600,
    textTransform: "uppercase",
  },
  amountBg: {
    color: theme.colors.fifth,
    fontWeight: 200,
    fontSize: 20,
  },
  value: {
    color: theme.colors.fourth,
    fontSize: 18,
    fontWeight: 200,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.eighth,
    margin: "16px 0",
  },
  row: {
    display: "flex",
    alignItems: "center",
    padding: "12px 0",
    "& img": {
      marginBottom: 0,
      marginRight: 16,
    },
    "&+&": {
      marginTop: 16,
    },
  },
  labelS: { color: theme.colors.fifth, fontSize: 14, fontWeight: 600, textTransform: "uppercase" },
  valueS: {
    fontSize: 14,
    fontWeight: 200,
    textTransform: "uppercase",
    color: theme.colors.fourth,
  },
  withdrawContent: {
    marginTop: 12,
    "&>*+*": {
      marginTop: 12,
    },
  },
  tableWrapper: {
    overflowX: "auto",
    paddingBottom: 12,
    "& table": {
      width: "100%",
      minWidth: 500,
      borderCollapse: "collapse",
      "& thead": {
        "& th": {
          textAlign: "center",
          padding: 4,
        },
      },
      "& tbody": {
        "& td": {
          textAlign: "center",
          padding: 4,
          borderTop: `1px solid ${theme.colors.fourth}`,
        },
      },
    },
  },

  balance: {
    color: transparentize(0.1, theme.colors.fourth),
    marginTop: 12,
  },
  withdraw: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    paddingTop: 6,
    paddingBottom: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colors.reverse,
    boxShadow: theme.colors.boxShadow1,
    "&:hover": {
      backgroundColor: `${transparentize(0.3, theme.colors.primary)} !important`,
    },
    "& span": {
      fontWeight: 600,
      fontSize: 14,
    },
    [theme.breakpoints.down(theme.custom.smd)]: {
      flex: "unset",
      width: "100%",
    },
  },
  newStakeWrapper: {
    marginTop: 12,
    marginBottom: 20,
    display: "flex",
    alignItems: "flex-start",
    "&>*": {
      flex: 1,
    },
    "&>*+*": {
      marginLeft: 12,
    },
    [theme.breakpoints.down(theme.custom.smd)]: {
      flexDirection: "column",
      "&>*": {
        flex: "unset",
        width: "100%",
      },
      "&>*+*": {
        marginLeft: 0,
        marginTop: 12,
      },
    },
  },
  monthsLabel: {
    color: transparentize(0.4, theme.colors.reverse),
    fontSize: 14,
    marginTop: 12,
    marginBottom: 10,
  },
  monthsWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "8px -4px",
    marginBottom: 16,
  },
  month: {
    color: transparentize(0.4, theme.colors.reverse),
    fontSize: 14,
  },

  stakeBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 22,
    height: 44,
    display: "inline-flex",
    width: 160,
    alignItems: "center",
    justifyContent: "center",
    color: theme.colors.reverse,
    boxShadow: theme.colors.boxShadow1,
    "&+&": { marginLeft: 12 },
    "&:hover": {
      backgroundColor: `${transparentize(0.3, theme.colors.primary)} !important`,
    },
    "& span": {
      fontWeight: 600,
    },
    [theme.breakpoints.down(theme.custom.smd)]: {
      flex: "unset",
      width: "100%",
      "&+&": { marginLeft: 0, marginTop: 8 },
    },
  },
}))

interface IState {
  totalMbfBalance: BigNumber
  stakeAmount: BigNumber
  totalStaked: BigNumber
  totalShares: BigNumber
  userTotalStaked: BigNumber
  stakeDays: number
  userStakes: IUserStaking[]
  userStakingCount: number
  estimatedEarning: BigNumber
  pendingRewards: BigNumber
}

const initialState = {
  totalMbfBalance: ZERO,
  stakeAmount: ZERO,
  totalStaked: ZERO,
  userTotalStaked: ZERO,
  stakeDays: 0,
  userStakes: [],
  userStakingCount: 0,
  estimatedEarning: ZERO,
  pendingRewards: ZERO,
  totalShares: ZERO,
}

const StakingPage = () => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()
  const [state, setState] = useState<IState>(initialState)
  const {
    account,
    library: provider,
    networkId,
    setTxModalInfo,
    setWalletConnectModalOpened,
  } = useConnectedWeb3Context()
  const mbfToken = getToken("mbf", networkId)
  const mbfBalance = useTokenBalance(mbfToken.address)
  const stakeContractAddress = getContractAddress("staking", networkId)
  const mbfPrice = useMBFPrice()

  const loadPublicInfo = async () => {
    try {
      const stakingService = new StakingService(
        provider || DefaultReadonlyProvider,
        account,
        stakeContractAddress
      )
      const mbfService = new ERC20Service(
        provider || DefaultReadonlyProvider,
        account,
        mbfToken.address
      )

      const [totalStaked, totalShares, totalMbfBalance] = await Promise.all([
        stakingService.totalStakes(),
        stakingService.totalShares(),
        mbfService.getBalanceOf(stakeContractAddress),
      ])

      setState((prev) => ({ ...prev, totalStaked, totalShares, totalMbfBalance }))
    } catch (error) {
      setState((prev) => ({ ...prev, totalStaked: ZERO, totalShares: ZERO, totalMbfBalance: ZERO }))
    }
  }

  const loadPersonalInfo = async () => {
    if (!account || !provider) {
      setWalletConnectModalOpened(true)

      setState((prev) => ({
        ...prev,
        userStakes: [],
        userStakingCount: 0,
        userTotalStaked: ZERO,
      }))
      return
    }
    try {
      const stakingService = new StakingService(provider, account, stakeContractAddress)
      const userStakingCount = (await stakingService.getUserStakingCount(account)).toNumber()
      const pendingRewards = await stakingService.getClaimableReward(account)

      const promises = []

      const loadInfo = async (index: number): Promise<IUserStaking> => {
        const stakingId = await stakingService.getUserStakingId(account, index)

        const userStaking = await stakingService.getUserStaking(stakingId)

        const penaltyRate = await stakingService.getPenaltyRateWei(
          userStaking.startDate,
          userStaking.steps
        )

        return { ...userStaking, penaltyRate }
      }

      for (let index = 0; index < userStakingCount; index++) {
        promises.push(loadInfo(index))
      }

      const userStakes = await Promise.all(promises)

      let userTotalStaked = ZERO

      userStakes.forEach((item) => {
        if (item.unstakeDate.isZero()) userTotalStaked = userTotalStaked.add(item.amount)
      })

      setState((prev) => ({
        ...prev,
        userStakes: userStakes,
        userStakingCount,
        userTotalStaked,
        pendingRewards,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        userStakes: [],
        userStakingCount: 0,
        userTotalStaked: ZERO,
        pendingRewards: ZERO,
      }))
    }
  }

  useEffect(() => {
    const loadShares = async () => {
      try {
        const stakingService = new StakingService(
          provider || DefaultReadonlyProvider,
          account,
          stakeContractAddress
        )
        const shares = await stakingService.getShares(state.stakeDays, state.stakeAmount)
        setState((prev) => ({ ...prev, estimatedEarning: shares }))
      } catch (error) {
        setState((prev) => ({ ...prev, estimatedEarning: ZERO }))
      }
    }

    const timer = setTimeout(loadShares, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [state.stakeDays, state.stakeAmount._hex])

  useEffect(() => {
    loadPublicInfo()

    const interval = setInterval(loadPublicInfo, 60000)

    return () => {
      clearInterval(interval)
    }
  }, [networkId])

  useEffect(() => {
    loadPersonalInfo()
  }, [account, networkId])

  const onStake = async () => {
    if (!account || !provider) {
      setWalletConnectModalOpened(true)
      return
    }
    try {
      setTxModalInfo(true, "Checking allowance...")
      const stakingService = new StakingService(
        provider || DefaultReadonlyProvider,
        account,
        stakeContractAddress
      )
      const mbfService = new ERC20Service(provider, account, mbfToken.address)

      const hasEnoughAllowance = await mbfService.hasEnoughAllowance(
        account,
        stakeContractAddress,
        state.stakeAmount
      )

      if (!hasEnoughAllowance) {
        setTxModalInfo(true, "Approving...")
        const hash = await mbfService.approveUnlimited(stakeContractAddress)
        setTxModalInfo(true, "Approving...", hash)
        await provider.waitForTransaction(hash)
      }

      setTxModalInfo(true, "Staking...")

      const hash = await stakingService.stake(state.stakeDays, state.stakeAmount)
      setTxModalInfo(true, "Staking...", hash)
      await provider.waitForTransaction(hash)
      setTxModalInfo(true, "Loading...")
      await loadPublicInfo()
      await loadPersonalInfo()
      setTxModalInfo(false)
    } catch (error) {
      setTxModalInfo(false)
    }
  }

  const onWithdraw = async (stakingId: BigNumber) => {
    if (!account || !provider) {
      setWalletConnectModalOpened(true)
      return
    }
    try {
      const stakingService = new StakingService(
        provider || DefaultReadonlyProvider,
        account,
        stakeContractAddress
      )

      setTxModalInfo(true, "Withdraw...")

      const hash = await stakingService.unstake(stakingId)
      setTxModalInfo(true, "Withdraw...", hash)
      await provider.waitForTransaction(hash)
      setTxModalInfo(true, "Loading...")
      await loadPublicInfo()
      await loadPersonalInfo()
      setTxModalInfo(false)
    } catch (error) {
      setTxModalInfo(false)
    }
  }

  const onClaim = async () => {
    if (!account || !provider) {
      setWalletConnectModalOpened(true)
      return
    }
    try {
      const stakingService = new StakingService(
        provider || DefaultReadonlyProvider,
        account,
        stakeContractAddress
      )

      setTxModalInfo(true, "Claim...")

      const hash = await stakingService.claimStableReward()
      setTxModalInfo(true, "Claim...", hash)
      await provider.waitForTransaction(hash)
      setTxModalInfo(true, "Loading...")
      await loadPublicInfo()
      await loadPersonalInfo()
      setTxModalInfo(false)
    } catch (error) {
      setTxModalInfo(false)
    }
  }

  const { activeInterest, personalTotalShare, personalTotalStaked } = (() => {
    let personalTotalStaked = ZERO
    let personalTotalShare = ZERO

    state.userStakes.forEach((userStake) => {
      if (userStake.unstakeDate.isZero()) {
        personalTotalStaked = personalTotalStaked.add(userStake.amount)
        personalTotalShare = personalTotalShare.add(userStake.shares)
      }
    })

    const activeInterest = state.totalShares.isZero()
      ? ZERO
      : personalTotalShare.mul(state.totalMbfBalance.sub(state.totalStaked)).div(state.totalShares)

    return { personalTotalStaked, personalTotalShare, activeInterest }
  })()

  return (
    <div className={classes.root}>
      <div className={clsx(commonClasses.content, classes.content)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <SectionWrapper className={classes.section}>
              <img alt="img" className={classes.img} src="/assets/staking/staked.svg" />
              <Typography align="center" className={classes.label}>
                total mbf staked
              </Typography>
              <Typography align="center" className={classes.value}>
                {numberWithCommas(
                  hideInsignificantZeros(formatBigNumber(state.totalStaked, mbfToken.decimals))
                )}{" "}
                {mbfToken.symbol.toUpperCase()}
              </Typography>
            </SectionWrapper>
          </Grid>
          <Grid xs={12} item sm={6} md={4}>
            <SectionWrapper className={classes.section}>
              <img alt="img" className={classes.img} src="/assets/staking/daily-release.svg" />
              <Typography align="center" className={classes.label}>
                total shares
              </Typography>
              <Typography align="center" className={classes.value}>
                {numberWithCommas(formatBigNumber(state.totalShares, SHARE_MULTIPLIER_DECIMALS, 0))}
              </Typography>
            </SectionWrapper>
          </Grid>
          <Grid xs={12} item sm={6} md={4}>
            <SectionWrapper className={classes.section}>
              <img alt="img" className={classes.img} src="/assets/staking/total-pool-weight.svg" />
              <Typography align="center" className={classes.label}>
                pool weight
              </Typography>
              <Typography align="center" className={classes.value}>
                {numberWithCommas(
                  formatBigNumber(personalTotalShare, SHARE_MULTIPLIER_DECIMALS, 0)
                )}{" "}
                (
                {state.totalShares.isZero()
                  ? "-"
                  : `${formatBigNumber(personalTotalShare.mul(100).div(state.totalShares), 0, 2)}%`}
                )
              </Typography>
            </SectionWrapper>
          </Grid>
          <Grid xs={12} item sm={6} md={4}>
            <SectionWrapper className={classes.section}>
              <Typography align="center" className={classes.label}>
                my portfolio
              </Typography>
              <Typography align="center" className={classes.amountBg}>
                {numberWithCommas(
                  hideInsignificantZeros(formatBigNumber(mbfBalance, mbfToken.decimals))
                )}{" "}
                {mbfToken.symbol.toUpperCase()}
              </Typography>
              <Typography align="center" className={classes.value}>
                ${" "}
                {numberWithCommas(
                  hideInsignificantZeros(
                    formatBigNumber(mbfBalance.mul(mbfPrice), mbfToken.decimals + ETHER_DECIMALS, 8)
                  )
                )}
              </Typography>
              <div className={classes.divider} />
              <div className={classes.row}>
                <img alt="img" className={classes.img} src="/assets/staking/staked.svg" />
                <div>
                  <Typography align="left" className={classes.labelS}>
                    staked
                  </Typography>
                  <Typography align="left" className={classes.valueS}>
                    {numberWithCommas(
                      hideInsignificantZeros(
                        formatBigNumber(personalTotalStaked, mbfToken.decimals)
                      )
                    )}{" "}
                    {mbfToken.symbol.toUpperCase()}
                  </Typography>
                  <Typography align="left" className={classes.valueS}>
                    ${" "}
                    {numberWithCommas(
                      hideInsignificantZeros(
                        formatBigNumber(
                          state.totalStaked.mul(mbfPrice),
                          mbfToken.decimals + ETHER_DECIMALS,
                          8
                        )
                      )
                    )}
                  </Typography>
                </div>
              </div>
              <div className={classes.row}>
                <img alt="img" className={classes.img} src="/assets/staking/active-interest.svg" />
                <div>
                  <Typography align="left" className={classes.labelS}>
                    active interest
                  </Typography>
                  <Typography align="left" className={classes.valueS}>
                    {numberWithCommas(formatBigNumber(activeInterest, mbfToken.decimals, 0))}{" "}
                    {mbfToken.symbol.toUpperCase()}
                  </Typography>
                  <Typography align="left" className={classes.valueS}>
                    ${" "}
                    {numberWithCommas(
                      hideInsignificantZeros(
                        formatBigNumber(
                          activeInterest.mul(mbfPrice),
                          mbfToken.decimals + PRICE_DECIMALS,
                          8
                        )
                      )
                    )}
                  </Typography>
                </div>
              </div>
              <div className={classes.row}>
                <img alt="img" className={classes.img} src="/assets/staking/liquid.svg" />
                <div>
                  <Typography align="left" className={classes.labelS}>
                    liquid
                  </Typography>
                  <Typography align="left" className={classes.valueS}>
                    {numberWithCommas(
                      hideInsignificantZeros(
                        formatBigNumber(state.pendingRewards, ETHER_DECIMALS, 6)
                      )
                    )}{" "}
                    BUSD
                  </Typography>
                  <Typography align="left" className={classes.valueS}>
                    ${" "}
                    {numberWithCommas(
                      hideInsignificantZeros(
                        formatBigNumber(state.pendingRewards, ETHER_DECIMALS, 6)
                      )
                    )}
                  </Typography>
                </div>
              </div>
            </SectionWrapper>
          </Grid>
          <Grid xs={12} item sm={12} md={8}>
            <SectionWrapper>
              <Typography align="left" className={classes.label}>
                add a new stake
              </Typography>
              <div className={classes.newStakeWrapper}>
                <div>
                  <BigNumberInput
                    value={state.stakeAmount}
                    onMax={() => setState((prev) => ({ ...prev, stakeAmount: mbfBalance }))}
                    onChange={(value) => setState((prev) => ({ ...prev, stakeAmount: value }))}
                    placeholder="Stake amount"
                    token={mbfToken}
                    maxLabel="Stake max"
                  />
                  <Typography className={classes.balance}>
                    Balance:{" "}
                    {numberWithCommas(
                      hideInsignificantZeros(formatBigNumber(mbfBalance, mbfToken.decimals, 2))
                    )}{" "}
                    {mbfToken.symbol.toUpperCase()}
                  </Typography>
                </div>
                <div>
                  <NumberInput
                    value={state.stakeDays}
                    onMax={() => setState((prev) => ({ ...prev, stakeDays: MAX_STAKE_DAYS }))}
                    onChange={(value) => setState((prev) => ({ ...prev, stakeDays: value }))}
                    placeholder="Stake days"
                    maxLabel="max"
                  />
                  <Typography className={classes.balance}>
                    Max stake length: {MAX_STAKE_DAYS}
                  </Typography>
                </div>
              </div>
              <Typography align="left" className={classes.label}>
                staking peirod
              </Typography>
              <div>
                <Typography className={classes.monthsLabel}>Years</Typography>
                <RangeSlider
                  value={Math.floor((state.stakeDays * 10) / 365)}
                  onChange={(value) => {
                    const days = Math.floor((value * 365) / 10)
                    setState((prev) => ({ ...prev, stakeDays: Math.min(days, MAX_STAKE_DAYS) }))
                  }}
                />
                <div className={classes.monthsWrapper}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
                    <span className={classes.month} key={value}>
                      {value}
                    </span>
                  ))}
                </div>
              </div>
              <Typography align="left" className={classes.label}>
                Estimated Earning:{" "}
                {numberWithCommas(
                  hideInsignificantZeros(
                    formatBigNumber(
                      state.estimatedEarning,
                      mbfToken.decimals + SHARE_MULTIPLIER_DECIMALS
                    )
                  )
                )}{" "}
                {mbfToken.symbol.toUpperCase()}
              </Typography>
              <br />
              <div>
                <Button
                  className={classes.stakeBtn}
                  color="primary"
                  disabled={state.stakeAmount.isZero() || state.stakeDays === 0}
                  variant="contained"
                  onClick={onStake}
                >
                  Stake $MBF now
                </Button>
              </div>
            </SectionWrapper>
            <SectionWrapper>
              <Typography align="left" className={classes.label}>
                claim rewards
              </Typography>
              <Typography align="left" className={classes.balance}>
                Pending Rewards:{" "}
                {numberWithCommas(
                  hideInsignificantZeros(formatBigNumber(state.pendingRewards, ETHER_DECIMALS, 6))
                )}{" "}
                BUSD
              </Typography>
              <br />
              <Button
                className={classes.withdraw}
                color="primary"
                disabled={state.pendingRewards.isZero()}
                variant="contained"
                onClick={onClaim}
              >
                Claim Rewards
              </Button>
            </SectionWrapper>

            <SectionWrapper>
              <Typography align="left" className={classes.label}>
                withdraw funds
              </Typography>
              <div className={classes.withdrawContent}>
                <div className={classes.tableWrapper}>
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Starting Date</th>
                        <th>Duration</th>
                        <th>Expected End Date</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.userStakes.map((userStake, index) => {
                        return (
                          <tr key={userStake.stakingId.toString()}>
                            <td>{index + 1}</td>
                            <td>
                              {moment(new Date(userStake.startDate.toNumber() * 1000)).format(
                                "MM/DD/YYYY"
                              )}
                            </td>
                            <td>{userStake.steps.toNumber()} Days</td>
                            <td>
                              {moment(
                                new Date(
                                  (userStake.startDate.toNumber() +
                                    userStake.steps.toNumber() * 60 * 60 * 24) *
                                    1000
                                )
                              ).format("MM/DD/YYYY")}
                            </td>
                            <td>
                              {numberWithCommas(
                                hideInsignificantZeros(
                                  formatBigNumber(userStake.amount, mbfToken.decimals)
                                )
                              )}{" "}
                              {mbfToken.symbol.toUpperCase()}
                            </td>
                            <td>
                              {userStake.unstakeDate.isZero() ? (
                                <Button
                                  className={classes.withdraw}
                                  color="primary"
                                  variant="contained"
                                  onClick={() => onWithdraw(userStake.stakingId)}
                                >
                                  Withdraw
                                  {userStake.penaltyRate.isZero()
                                    ? ""
                                    : ` (${hideInsignificantZeros(
                                        formatBigNumber(userStake.penaltyRate, ETHER_DECIMALS)
                                      )}% penalty)`}
                                </Button>
                              ) : (
                                <Typography className={classes.balance}>Unstaked</Typography>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </SectionWrapper>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default StakingPage

import { Input, InputAdornment, makeStyles } from "@material-ui/core"
import clsx from "clsx"
import { BigNumber, ethers } from "ethers"
import { transparentize } from "polished"
import React, { useEffect, useState } from "react"
import { IToken } from "types"

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "12px 16px",
    borderRadius: 12,
    backgroundColor: transparentize(0.4, theme.colors.eighth),
  },
  input: {
    color: theme.colors.fourth,
    "& input": { textAlign: "left" },
  },
  max: {
    color: transparentize(0.1, theme.colors.reverse),
    padding: "4px 8px",
    borderRadius: 8,
    cursor: "pointer",
    transition: "all 0.4s",
    "&:hover": {
      opacity: 0.7,
    },
  },
  unit: {
    color: theme.colors.primary,
  },
}))

interface IProps {
  className?: string
  value: BigNumber
  onChange: (value: BigNumber) => void
  token: IToken
  onMax: () => void
  placeholder?: string
  maxLabel?: string
}

interface IState {
  amount: string
}

export const BigNumberInput = (props: IProps) => {
  const { maxLabel, onChange, onMax, placeholder, token } = props
  const [state, setState] = useState<IState>({ amount: "0" })
  const classes = useStyles()

  useEffect(() => {
    if (!ethers.utils.parseUnits(state.amount || "0", token.decimals).eq(props.value)) {
      setState((prev) => ({
        ...prev,
        amount: ethers.utils.formatUnits(props.value || "0", token.decimals),
      }))
    }
  }, [props.value, state.amount, token.decimals])

  return (
    <div className={clsx(classes.root, props.className)}>
      <Input
        className={classes.input}
        disableUnderline
        fullWidth
        value={state.amount}
        onChange={(e) => {
          if (Number(e.target.value) < 0) return
          setState((prev) => ({ ...prev, amount: e.target.value }))
          onChange(ethers.utils.parseUnits(e.target.value || "0", token.decimals))
        }}
        placeholder={placeholder || "Amount"}
        type="number"
        endAdornment={
          <InputAdornment position="end">
            <>
              <span className={classes.max} onClick={onMax}>
                {maxLabel || "Use max"}
              </span>
            </>
          </InputAdornment>
        }
      />
    </div>
  )
}

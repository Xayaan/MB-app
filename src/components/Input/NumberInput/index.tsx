import { Input, InputAdornment, makeStyles } from "@material-ui/core"
import clsx from "clsx"
import { transparentize } from "polished"
import React, { useEffect, useState } from "react"

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
  value: number
  onMax: () => void
  placeholder?: string
  maxLabel?: string
  onChange: (_: number) => void
}

interface IState {
  amount: string
}

export const NumberInput = (props: IProps) => {
  const { maxLabel, onChange, onMax, placeholder } = props
  const [state, setState] = useState<IState>({ amount: "0" })
  const classes = useStyles()

  useEffect(() => {
    if (parseInt(state.amount || "0") !== props.value) {
      setState((prev) => ({
        ...prev,
        amount: props.value.toString(),
      }))
    }
  }, [props.value, state.amount])

  return (
    <div className={clsx(classes.root, props.className)}>
      <Input
        className={classes.input}
        disableUnderline
        fullWidth
        value={state.amount}
        onChange={(e) => {
          if (Number(e.target.value) < 0) return
          const newValue = Math.round(parseInt(e.target.value || "0"))
          setState((prev) => ({ ...prev, amount: newValue.toString() }))
          onChange(newValue)
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

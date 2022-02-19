import { makeStyles } from "@material-ui/core"
import clsx from "clsx"
import React from "react"
import { Range } from "react-range"

const useStyles = makeStyles((theme) => ({
  root: {},
  track: {
    backgroundColor: "#FFE5C9",
    height: 8,
    borderRadius: 4,
    position: "relative",
  },
  track_active: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 4,
    background: "linear-gradient(#FFA536, #FFD166)",
    zIndex: -1,
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    border: `5px solid ${theme.colors.default}`,
    backgroundColor: theme.colors.primary,
    outline: "none",
    boxShadow: "0 0 2px 0 rgba(0,0,0,0.25)",
  },
}))

interface IProps {
  value: number
  onChange: (value: number) => void
  className?: string
}

export const RangeSlider = (props: IProps) => {
  const classes = useStyles()

  const currentValue = props.value
  return (
    <div className={clsx(classes.root, props.className)}>
      <Range
        step={1}
        min={0}
        max={100}
        values={[props.value]}
        onChange={(values) => props.onChange(values[0])}
        renderTrack={({ children, props }) => (
          <div {...props} className={classes.track}>
            {children}
            <div className={classes.track_active} style={{ width: `${currentValue}%` }} />
          </div>
        )}
        renderThumb={({ props }) => <div {...props} className={classes.thumb} />}
      />
    </div>
  )
}

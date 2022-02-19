import { Button, makeStyles } from "@material-ui/core"
import clsx from "clsx"
import React from "react"

const useStyles = makeStyles((theme) => ({
  root: {
    height: 58,
    background: theme.colors.primary,
    borderRadius: 2,
    "& span": { flex: 1, textAlign: "left" },
    "& svg": {
      height: theme.spacing(3.5),
      width: theme.spacing(3.5),
    },
  },
  label: {
    color: theme.colors.secondary,
    textTransform: "none",
    fontWeight: 700,
    fontSize: 16,
    lineHeight: "24px",
  },
}))

interface IProps {
  className?: string
  onClick: () => void
  disabled?: boolean
  text: string
  icon: React.ElementType
}

export const ConnectWalletButton = (props: IProps) => {
  const classes = useStyles()
  const { disabled = false, icon: Icon, onClick, text } = props
  return (
    <Button
      className={clsx(classes.root, props.className)}
      classes={{ label: classes.label }}
      disabled={disabled}
      fullWidth
      onClick={onClick}
      variant="contained"
    >
      <span>{text}</span>

      <Icon />
    </Button>
  )
}

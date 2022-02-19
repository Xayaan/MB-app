import { makeStyles } from "@material-ui/core"
import clsx from "clsx"
import React from "react"

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: theme.colors.default,
    "& + &": {
      marginTop: 24,
    },
  },
}))

interface IProps {
  className?: string
  children: React.ReactNode | React.ReactNode[]
}

export const SectionWrapper = (props: IProps) => {
  const classes = useStyles()

  return <div className={clsx(classes.root, props.className)}>{props.children}</div>
}

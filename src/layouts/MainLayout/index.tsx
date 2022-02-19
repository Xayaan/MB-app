import { makeStyles } from "@material-ui/core"
import React from "react"

import { Footer, Header } from "./components"

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    paddingTop: theme.custom.appHeaderHeight,
    minHeight: "calc(100vh - 109px)",
    backgroundColor: theme.colors.secondary,
    [theme.breakpoints.down(theme.custom.smd)]: {
      paddingTop: (theme.custom.appHeaderHeight * 2) / 3,
    },
  },
}))

interface IProps {
  children?: React.ReactNode | React.ReactNode[]
}

export const MainLayout = (props: IProps) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Header />
      <main className={classes.content}>{props.children}</main>
      <Footer />
    </div>
  )
}

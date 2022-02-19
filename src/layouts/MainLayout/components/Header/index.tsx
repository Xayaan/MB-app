import { IconButton, makeStyles } from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import clsx from "clsx"
import { transparentize } from "polished"
import React, { useEffect, useState } from "react"
import { matchPath, NavLink, useHistory } from "react-router-dom"
import useCommonStyles from "style/common"

import { AccountInfo } from "../AccountInfo"

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    zIndex: 10,
    top: 0,
    left: 0,
    right: 0,
    height: theme.custom.appHeaderHeight,
    backgroundColor: theme.colors.secondary,
    padding: "8px 0",
    [theme.breakpoints.down(theme.custom.smd)]: {
      height: (theme.custom.appHeaderHeight * 2) / 3,
    },
  },
  content: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    "& img": {
      width: 90,
      height: 90,
      [theme.breakpoints.down(theme.custom.smd)]: {
        width: 60,
        height: 60,
      },
    },
  },
  items: {
    backgroundColor: theme.colors.third,
    height: 40,
    borderRadius: 15,
    display: "flex",
    alignItems: "center",
    padding: 5,
  },
  item: {
    height: "100%",
    margin: "0 2px",
    textDecoration: "none",
    color: theme.colors.fourth,
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    transition: "all 0.5s",
    "&.active": {
      color: theme.colors.third,
      backgroundColor: theme.colors.primary,
    },
    [theme.breakpoints.down(theme.custom.smd)]: {
      height: 40,
      textAlign: "center",
      marginTop: 20,
      backgroundColor: transparentize(0.6, theme.colors.primary),
    },
  },
  menuButton: {
    color: theme.colors.default,
  },
  navbar: {
    position: "fixed",
    padding: "50px 16px",
    top: 0,
    bottom: 0,
    zIndex: 20,
    left: -theme.custom.appNavbarWidth - 20,
    width: theme.custom.appNavbarWidth,
    transition: "all 0.5s",
    "&.visible": { left: 0 },
    backgroundColor: transparentize(0.05, theme.colors.secondary),
    boxShadow: `1px 2px 3px 1px ${theme.colors.reverse}`,
    [theme.breakpoints.up(theme.custom.smd)]: {
      display: "none",
    },
  },
}))

const items = [
  { id: "stake", href: "/", label: "Stake" },
  { id: "swap", href: "/swap", label: "Swap" },
  // { id: "claim", href: "/claim", label: "Claim" },
  { id: "stats", href: "/stats", label: "Stats" },
]

export const Header = () => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()
  const history = useHistory()
  const [navbarVisibe, setNavbarVisible] = useState(false)

  useEffect(() => {
    setNavbarVisible(() => false)
  }, [history.location.pathname])

  const renderItems = () => {
    return (
      <>
        {items.map((item) => (
          <NavLink
            key={item.id}
            isActive={() =>
              !!matchPath(history.location.pathname, {
                path: item.href,
                exact: true,
              })
            }
            className={classes.item}
            to={item.href}
          >
            {item.label}
          </NavLink>
        ))}
      </>
    )
  }

  return (
    <div className={classes.root}>
      <div className={clsx(commonClasses.content, classes.content)}>
        <NavLink className={classes.logo} to="/">
          <img alt="img" src="/assets/logo.png" />
        </NavLink>
        <div className={clsx(classes.items, commonClasses.showUpSmd)}>{renderItems()}</div>
        <AccountInfo />
        <IconButton
          className={clsx(classes.menuButton, commonClasses.showUnderSmd)}
          onClick={() => setNavbarVisible((navbarVisibe) => !navbarVisibe)}
        >
          <MenuIcon />
        </IconButton>
      </div>
      <div className={clsx(classes.navbar, navbarVisibe ? "visible" : "")}>{renderItems()}</div>
    </div>
  )
}

import { makeStyles, Typography } from "@material-ui/core"
import clsx from "clsx"
import React from "react"
import useCommonStyles from "style/common"

const useStyles = makeStyles((theme) => ({
  root: { backgroundColor: theme.colors.fifth },
  content: {
    padding: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.down(theme.custom.smd)]: {
      flexDirection: "column",
    },
  },
  label: {
    color: theme.colors.default,
    fontSize: 14,
    fontWeight: 200,
    [theme.breakpoints.down(theme.custom.smd)]: {
      marginBottom: 20,
    },
  },
  items: {},
  item: {
    width: 35,
    height: 35,
    display: "inline-block",
    "& + &": {
      marginLeft: 15,
    },
  },
}))

const items = [
  {
    id: "medium",
    icon: "/assets/social/medium.svg",
    href: "https://click.moonbear.finance/medium",
  },
  {
    id: "youtube",
    icon: "/assets/social/youtube.svg",
    href: "https://click.moonbear.finance/youtube",
  },
  {
    id: "telegram",
    icon: "/assets/social/telegram.svg",
    href: "https://click.moonbear.finance/telegram",
  },
  {
    id: "twitter",
    icon: "/assets/social/twitter.svg",
    href: "https://click.moonbear.finance/twitter",
  },
  {
    id: "discord",
    icon: "/assets/social/discord.svg",
    href: "https://click.moonbear.finance/discord",
  },
]

export const Footer = () => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()

  return (
    <div className={classes.root}>
      <div className={clsx(commonClasses.content, classes.content)}>
        <Typography align="center" className={classes.label}>
          Copyright © 2021 MoonBear Finance. All rights reserved.
        </Typography>
        <div className={classes.items}>
          {items.map((item) => (
            <a
              className={classes.item}
              href={item.href}
              key={item.id}
              rel="noreferrer"
              target="_blank"
            >
              <img alt="img" src={item.icon} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

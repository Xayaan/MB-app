import { Button, makeStyles } from "@material-ui/core"
import { useConnectedWeb3Context } from "contexts"
import { transparentize } from "polished"
import React from "react"

const useStyles = makeStyles((theme) => ({
  root: {},
  connected: {
    borderRadius: 22,
    padding: "6px 16px",
    paddingRight: 50,
    backgroundColor: transparentize(0.9, theme.colors.primary),
    border: `1px solid ${theme.colors.primary}`,
    position: "relative",
    "&::after": {
      position: "absolute",
      right: 20,
      width: 10,
      height: 10,
      borderRadius: "50%",
      content: `" "`,
      backgroundColor: theme.colors.seventh,
    },
  },
  connect: {
    borderRadius: 22,
    padding: "6px 16px",
    backgroundColor: transparentize(0.9, theme.colors.primary),
  },
}))

export const AccountInfo = () => {
  const classes = useStyles()
  const { account, onDisconnect, setWalletConnectModalOpened } = useConnectedWeb3Context()
  const isConnected = account
  return (
    <div className={classes.root}>
      {isConnected ? (
        <Button
          className={classes.connected}
          color="primary"
          onClick={() => onDisconnect()}
          variant="contained"
        >
          {account?.substr(0, 6)}...{account?.substr(-4)}
        </Button>
      ) : (
        <Button
          className={classes.connect}
          color="primary"
          onClick={() => setWalletConnectModalOpened(true)}
          variant="contained"
        >
          Connect Wallet
        </Button>
      )}
    </div>
  )
}

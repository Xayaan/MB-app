import { CircularProgress, Modal, Typography, makeStyles } from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"
import { useWeb3React } from "@web3-react/core"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"
import { ConnectWalletButton } from "components/Button"
import { STORAGE_KEY_CONNECTOR, WALLET_ICONS } from "config/constants"
import { getEtherscanUri, setupNetwork, supportedNetworkIds } from "config/network"
import { useConnectedWeb3Context } from "contexts"
import { useSnackbar } from "notistack"
import { transparentize } from "polished"
import React, { useCallback, useEffect } from "react"
import { EConnectorNames } from "types/enums"
import connectors from "utils/connectors"
import { getLogger } from "utils/logger"

const logger = getLogger("ConnectWalletModal::Index")

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    outline: "none",
    backgroundColor: theme.colors.secondary,
    width: 400,
    borderRadius: theme.spacing(2),
    padding: `${theme.spacing(3)}px`,
    userSelect: `none`,
    position: "relative",
    textAlign: "center",
  },
  title: {
    color: theme.colors.default,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: theme.spacing(2.5),
    marginBottom: theme.spacing(3),
  },
  progress: {
    color: transparentize(0.4, theme.colors.default),
  },
  viewTx: {
    color: transparentize(0.4, theme.colors.default),
    textDecoration: "none",
  },
}))

interface IProps {
  onClose: () => void
  description?: string
  txHash?: string
}

export const TransactionModal = (props: IProps) => {
  const context = useWeb3React()
  const classes = useStyles()
  const { description, onClose, txHash } = props
  const { enqueueSnackbar } = useSnackbar()
  const { networkId } = useConnectedWeb3Context()
  const etherscanUri = getEtherscanUri(networkId)

  return (
    <>
      <Modal
        className={classes.modal}
        disableBackdropClick
        disableEnforceFocus
        onClose={onClose}
        open
      >
        <div className={classes.content}>
          <Typography className={classes.title}>{description || "Loading ..."}</Typography>
          <CircularProgress className={classes.progress} />
          {txHash && (
            <>
              <br />
              <br />
              <a
                className={classes.viewTx}
                target="_blank"
                rel="noreferrer"
                href={`${etherscanUri}tx/${txHash}`}
              >
                View TX
              </a>
            </>
          )}
        </div>
      </Modal>
    </>
  )
}

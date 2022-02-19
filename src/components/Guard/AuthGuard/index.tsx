import { useConnectedWeb3Context } from "contexts"
import React from "react"
import { Redirect } from "react-router-dom"

interface IProps {
  children: React.ReactNode | React.ReactNode[]
}

export const AuthGuard = (props: IProps) => {
  const { account } = useConnectedWeb3Context()

  if (!account) {
    return <Redirect to="/" />
  }
  return <>{props.children}</>
}

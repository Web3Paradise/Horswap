import { useWeb3React, Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { connections, getConnection } from 'connection'
import { isSupportedChain } from 'constants/chains'
import { RPC_PROVIDERS } from 'constants/providers'
import usePrevious from 'hooks/usePrevious'
import { ReactNode, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useConnectedWallets } from 'state/wallets/hooks'
import { getCurrentPageFromLocation } from 'utils/urlRoutes'

export default function Web3Provider({ children }: { children: ReactNode }) {
  const connectors = connections.map<[Connector, Web3ReactHooks]>(({ hooks, connector }) => [connector, hooks])

  return (
    <Web3ReactProvider connectors={connectors}>
      <Updater />
      {children}
    </Web3ReactProvider>
  )
}

/** A component to run hooks under the Web3ReactProvider context. */
function Updater() {
  const { account, chainId, connector, provider } = useWeb3React()
  const { pathname } = useLocation()
  const currentPage = getCurrentPageFromLocation(pathname)

  const providers = RPC_PROVIDERS

  // Trace RPC calls (for debugging).
  const networkProvider = isSupportedChain(chainId) ? providers[chainId] : undefined
  useEffect(() => {
    return () => {
      provider?.off('debug', trace)
      networkProvider?.off('debug', trace)
    }
  }, [networkProvider, provider])

  // Send analytics events when the active account changes.
  const previousAccount = usePrevious(account)
  const [connectedWallets, addConnectedWallet] = useConnectedWallets()
  useEffect(() => {
    if (account && account !== previousAccount) {
      const walletType = getConnection(connector).getName()
      addConnectedWallet({ account, walletType })
    }
  }, [account, addConnectedWallet, currentPage, chainId, connectedWallets, connector, previousAccount, provider])

  return null
}

function trace(event: any) {
  if (!event?.request) return
  const { method, id, params } = event.request
  console.groupCollapsed(method, id)
  console.debug(params)
  console.groupEnd()
}

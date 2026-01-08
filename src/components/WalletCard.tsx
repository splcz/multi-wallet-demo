import { useState, useEffect } from 'react'
import type { Connector } from 'wagmi'

interface WalletCardProps {
  connector: Connector
  isConnected: boolean
  connection?: {
    accounts: readonly `0x${string}`[]
    chainId: number
  }
  isPending: boolean
  onConnect: () => void
  onDisconnect: () => void
}

// 链名称映射
const chainNames: Record<number, string> = {
  1: 'Ethereum Mainnet',
  11155111: 'Ethereum Sepolia',
  137: 'Polygon',
  56: 'BNB Chain',
  42161: 'Arbitrum One',
  10: 'Optimism',
}

export function WalletCard({
  connector,
  isConnected,
  connection,
  isPending,
  onConnect,
  onDisconnect,
}: WalletCardProps) {
  const [ready, setReady] = useState(false)
  const [icon, setIcon] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const provider = await connector.getProvider()
      setReady(!!provider)
    })()
  }, [connector])

  useEffect(() => {
    if (connector.icon) {
      setIcon(connector.icon)
    }
  }, [connector])

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}…${address.slice(-4)}`
  }

  const getChainName = (chainId: number) => {
    return chainNames[chainId] || `Chain ${chainId}`
  }

  const handleCopyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address)
  }

  return (
    <div className={`wallet-card ${isConnected ? 'connected' : ''}`}>
      <div className="wallet-header">
        <div className="wallet-info">
          {icon ? (
            <img src={icon} alt={connector.name} className="wallet-icon" />
          ) : (
            <div className="wallet-icon-placeholder">
              {connector.name.charAt(0)}
            </div>
          )}
          <span className="wallet-name">{connector.name}</span>
          
          {isConnected && connection && (
            <a 
              href={`https://etherscan.io/address/${connection.accounts[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="chain-badge"
            >
              {getChainName(connection.chainId)} ↗
            </a>
          )}
        </div>

        {isConnected ? (
          <button 
            className="status-badge connected"
            onClick={onDisconnect}
          >
            Connected
            <span className="status-dot"></span>
          </button>
        ) : (
          <button
            className="connect-btn"
            disabled={!ready || isPending}
            onClick={onConnect}
          >
            {isPending ? 'Connecting...' : 'Connect'}
          </button>
        )}
      </div>

      {isConnected && connection && (
        <div className="wallet-account">
          <span className="account-address">
            {shortenAddress(connection.accounts[0])}
          </span>
          <button 
            className="copy-btn"
            onClick={() => handleCopyAddress(connection.accounts[0])}
            title="复制地址"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}


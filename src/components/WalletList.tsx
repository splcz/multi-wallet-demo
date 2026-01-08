import { useConnect, useConnections, useDisconnect } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { WalletCard } from './WalletCard'
import type { Connector } from 'wagmi'

export function WalletList() {
  const { connectors, connect, isPending, variables } = useConnect()
  console.log('connectors: ', connectors)
  const connections = useConnections()
  console.log('connections: ', connections)
  const { disconnect } = useDisconnect()

  // 获取连接器的连接状态
  const getConnectionForConnector = (connector: Connector) => {
    return connections.find((conn) => conn.connector.uid === connector.uid)
  }

  // 检查特定连接器是否正在连接中
  const isConnectorPending = (connector: Connector) => {
    if (!isPending || !variables?.connector) return false
    const pendingConnector = variables.connector as Connector
    return pendingConnector.uid === connector.uid
  }

  return (
    <div className="wallet-list">
      {connectors.map((connector) => {
        const connection = getConnectionForConnector(connector)
        const isConnected = !!connection
        
        return (
          <WalletCard
            key={connector.uid}
            connector={connector}
            isConnected={isConnected}
            connection={connection}
            isPending={isConnectorPending(connector)}
            onConnect={() => connect({ connector, chainId: mainnet.id })}
            onDisconnect={() => disconnect({ connector })}
          />
        )
      })}
      
      {connectors.length === 0 && (
        <div className="no-wallets">
          <p>未检测到任何浏览器钱包</p>
          <p className="hint">请安装 MetaMask、Phantom 或其他 EIP-6963 兼容钱包</p>
        </div>
      )}
    </div>
  )
}


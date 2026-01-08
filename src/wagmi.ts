import { http, createConfig, createStorage } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, sepolia],
  // multiInjectedProviderDiscovery 默认为 true，会自动发现所有 EIP-6963 兼容的钱包
  multiInjectedProviderDiscovery: true,
  // 使用 localStorage 持久化连接状态
  storage: createStorage({ 
    storage: window.localStorage,
    key: 'wagmi-multi-wallet',
  }),
  // 同步连接的链
  syncConnectedChain: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}


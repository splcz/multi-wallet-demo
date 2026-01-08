import { WalletList } from './components/WalletList'

function App() {
  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Multi-Wallet Demo</h1>
        <p className="subtitle">检测并连接多个浏览器钱包</p>
        <WalletList />
      </div>
      <div className="watermark">liuchengzhong-2024</div>
    </div>
  )
}

export default App


const Web3 = require("web3")
const config = require("../config")

const MumbaiProvider = new Web3.providers.HttpProvider(process.env.RPC_MUMBAI, config.rpcConnection)
const PolygonProvider = new Web3.providers.HttpProvider(process.env.RPC_POLYGON, config.rpcConnection)
const ETHProvider = new Web3.providers.HttpProvider(process.env.RPC_ETH, config.rpcConnection)
const AVAXProvider = new Web3.providers.HttpProvider(process.env.RPC_AVAX, config.rpcConnection)
const BSCProvider = new Web3.providers.HttpProvider(process.env.RPC_BSC, config.rpcConnection)
const FTMProvider = new Web3.providers.HttpProvider(process.env.RPC_FTM, config.rpcConnection)
const ARBProvider = new Web3.providers.HttpProvider(process.env.RPC_ARB, config.rpcConnection)
const CROProvider = new Web3.providers.HttpProvider(process.env.RPC_CRO, config.rpcConnection)


function getProvider (chain) {
  switch (chain) {
    case 'mumbai':
      return MumbaiProvider
    case 'polygon':
      return PolygonProvider
    case 'eth':
      return ETHProvider
    case 'avalanche':
      return AVAXProvider
    case 'bsc':
      return BSCProvider
    case 'fantom':
      return FTMProvider
    case 'arbitrum':
      return ARBProvider
    case 'cronos':
      return CROProvider
  }
}

module.exports = (chain) => { 
  let Provider = getProvider(chain)
  const web3 = new Web3(Provider)

  /*Provider.on('error', (error) => {
    console.error("Provider Error", error)
    Provider = getProvider(chain)
    web3.setProvider(Provider)
  })

  Provider.on('end', (error) => {
    console.error("Provider End", error)
    Provider = getProvider(chain)
    web3.setProvider(Provider)
  })*/

  setInterval(() => {
    const connected = Provider.connected
    if (!connected) {
      console.log('Provider not connected')
    }
  }, 15000)

  return web3
}
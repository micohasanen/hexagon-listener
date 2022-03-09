const Web3 = require("web3")
const config = {
  keepAlive: true,
  timeout: 20000,
  clientConfig:{
    maxReceivedFrameSize: 10000000000,
    maxReceivedMessageSize: 10000000000,
  },
  reconnect: {
    auto: true,
    delay: 5000,
    maxAttempts: 20,
    onTimeout: false
  }
}

const MumbaiProvider = new Web3(new Web3.providers.WebsocketProvider(process.env.RPC_MUMBAI, config))
const PolygonProvider = new Web3(new Web3.providers.WebsocketProvider(process.env.RPC_POLYGON, config))
const ETHProvider = new Web3(new Web3.providers.WebsocketProvider(process.env.RPC_ETH, config))

function getProvider (chain) {
  switch (chain) {
    case 'mumbai':
      return MumbaiProvider
    case 'polygon':
      return PolygonProvider
    case 'eth':
      return ETHProvider
  }
}

module.exports = (chain) => { 
  const Provider = getProvider(chain)
  return Provider
}
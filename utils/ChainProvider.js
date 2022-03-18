const Web3 = require("web3")
const config = require("../config")

const MumbaiProvider = new Web3.providers.WebsocketProvider(process.env.RPC_MUMBAI, config.socketConnection)
const PolygonProvider = new Web3.providers.WebsocketProvider(process.env.RPC_POLYGON, config.socketConnection)
const ETHProvider = new Web3.providers.WebsocketProvider(process.env.RPC_ETH, config.socketConnection)

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
  let Provider = getProvider(chain)
  const web3 = new Web3(Provider)

  Provider.on('error', (error) => {
    console.error("Provider Error", error)
    Provider = getProvider(chain)
    web3.setProvider(Provider)
  })

  Provider.on('end', (error) => {
    console.error("Provider End", error)
    Provider = getProvider(chain)
    web3.setProvider(Provider)
  })

  return web3
}
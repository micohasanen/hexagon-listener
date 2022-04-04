module.exports = {
  redisConnection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
    connectTimeout: 10000,
    lazyConnect: true
  },
  rpcConnection: {
    keepAlive: true,
    timeout: 20000
  },
  listener: {
    interval: 10000
  },
  socketConnection: {
    timeout: 20000,
    clientConfig:{
      keepalive: true,
      keepaliveInterval: 60000,
      maxReceivedFrameSize: 10000000000,
      maxReceivedMessageSize: 10000000000,
    },
    reconnect: {
      auto: true,
      delay: 5000,
      maxAttempts: 100,
      onTimeout: true
    }
  },
  marketplaces: [
    { chain: 'mumbai', address: process.env.MARKETPLACE_MUMBAI },
    { chain: 'polygon', address: process.env.MARKETPLACE_POLYGON }
  ]
}
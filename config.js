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
    { chain: 'mumbai', address: '0xfDBdE84e30e4b8eCf063b98B041925c64B78c798' },
    { chain: 'polygon', address: '0xcd3b66f97B5461318FeDC291c0DBBb2e6590F029' }
  ]
}
module.exports = {
  redisConnection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
    connectTimeout: 10000,
    lazyConnect: true
  },
  socketConnection: {
    timeout: 20000,
    clientConfig:{
      keepAlive: true,
      keepAliveInterval: 60000,
      maxReceivedFrameSize: 10000000000,
      maxReceivedMessageSize: 10000000000,
    },
    reconnect: {
      auto: true,
      delay: 5000,
      maxAttempts: 100,
      onTimeout: true
    }
  }
}
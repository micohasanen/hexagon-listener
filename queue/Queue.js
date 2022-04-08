const config = require('../config')
const { Queue, QueueScheduler } = require("bullmq")
const { nanoid } = require("nanoid")

// Queues
const transferQueue = new Queue('transfers', { connection: config.redisConnection })
new QueueScheduler('transfers', { connection: config.redisConnection })
const listingQueue = new Queue('listings', { connection: config.redisConnection })
const bidQueue = new Queue('bids', { connection: config.redisConnection })
const auctionQueue = new Queue('auctions', { connection: config.redisConnection })

exports.addTransfer = async (data) => {
  await transferQueue.add(nanoid(), data, { delay: 30000 })
}

exports.addToListingQueue = async (data) => {
  await listingQueue.add(nanoid(), data)
}

exports.addToBidQueue = async (data) => {
  await bidQueue.add(nanoid(), data)
}

exports.addToAuctionQueue = async (data) => {
  await auctionQueue.add(nanoid(), data)
}

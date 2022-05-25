const ABI_Marketplace = require("../abis/Marketplace.json")
const GetProvider = require("../utils/ChainProvider")
const { addToListingQueue, addToBidQueue, addToAuctionQueue } = require("../queue/Queue") 
const config = require("../config")

function logEvents(events) {
  events.forEach((data) => {
    console.log("Marketplace Event:", data.event)

    // Okay, switch might have been cleaner
    if (data.event === 'ListingAccepted') {
      addToListingQueue({
        ...data,
        ...data.returnValues,
        eventType: 'accepted'
      })
    } else if (data.event === 'ListingCanceled') {
        addToListingQueue({
          ...data,
          ...data.returnValues,
          eventType: 'canceled'
        })
    } else if (data.event === 'BidAccepted') {
        addToBidQueue({
          ...data,
          ...data.returnValues,
          eventType: 'accepted'
        })
    } else if (data.event === 'BidCanceled') {
        addToBidQueue({
          ...data,
          ...data.returnValues,
          eventType: 'canceled'
        })
    } else if (data.event === 'AuctionPlaced') {
        addToAuctionQueue({
          ...data,
          ...data.returnValues,
          eventType: 'placed'
        })
    } else if (data.event === 'AuctionBid') {
        addToAuctionQueue({
          ...data,
          ...data.returnValues,
          eventType: 'bid'
        })
    } else if (data.event === 'AuctionConcluded') {
        addToAuctionQueue({
          ...data,
          ...data.returnValues,
          eventType: 'concluded'
        })
    }
  })
}

module.exports = async ({ chain, address }) => {
  try {
    const Provider = GetProvider(chain)
    const contract = new Provider.eth.Contract(ABI_Marketplace, address)

    let startBlock = await Provider.eth.getBlockNumber()
    console.log(chain, 'marketplace listener setup')

    setInterval(async () => {
      const currentBlock = await Provider.eth.getBlock('latest')
      if (currentBlock?.number > startBlock) {
        const events = await contract.getPastEvents('allEvents', {
          fromBlock: startBlock,
          toBlock: currentBlock.number
        })

        if (events?.length) logEvents(events)

        startBlock = currentBlock.number + 1
      }
    }, config.listener.interval)
  } catch (error) {
    console.error(error)
  }
}
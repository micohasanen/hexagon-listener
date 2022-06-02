const ABI_Marketplace = require("../abis/Marketplace.json")
const GetProvider = require("../utils/ChainProvider")
const { addToListingQueue, addToBidQueue, addToAuctionQueue } = require("../queue/Queue") 
const config = require("../config")

// Models
const  ListenerStatus = require("../models/ListenerStatus")

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

    let startBlock;

    const listenerStatus = await ListenerStatus.findOne({ 
      chain :collection.chain,
      id: "marketplace:"+address
    })
    if (!listenerStatus) {
       startBlock = await Provider.eth.getBlockNumber()
       listenerStatus.chain =  collection.chain
       listenerStatus.blockNumber = startBlock
       listenerStatus.id = "marketplace:"+address
       await listenerStatus.save()
    } else {
      startBlock = listenerStatus.blockNumber
    }


    console.log(chain, 'marketplace listener setup')

    setInterval(async () => {
      const currentBlock = await Provider.eth.getBlock('latest')
      if (currentBlock?.number > startBlock) {
        const events = await contract.getPastEvents('allEvents', {
          fromBlock: startBlock,
          toBlock: currentBlock.number
        })

        if (events?.length) logEvents(events)

        listenerStatus.blockNumber = currentBlock.number + 1
        await listenerStatus.save()

      }
    }, config.listener.interval)
  } catch (error) {
    console.error(error)
  }
}
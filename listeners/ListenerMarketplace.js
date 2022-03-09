const ABI_Marketplace = require("../abis/Marketplace.json")
const GetProvider = require("../utils/ChainProvider")
const { addToListingQueue, addToBidQueue, addToAuctionQueue } = require("../queue/Queue") 

module.exports = () => {
  const chain = process.env.MARKETPLACE_CHAIN
  const address = process.env.MARKETPLACE_ADDRESS
  const Provider = GetProvider(chain)
  const contract = new Provider.eth.Contract(ABI_Marketplace, address)

  const listener = contract.events.allEvents({
    fromBlock: 'latest'
  })

  listener.on('data', (data) => {
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

  console.log("Setup Marketplace Listener for", chain)
}
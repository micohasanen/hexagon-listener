const ABI_ERC721 = require("../abis/ERC721.json")
const ABI_ERC1155 = require("../abis/ERC1155.json")
const GetProvider = require("../utils/ChainProvider")
const { addTransfer } = require("../queue/Queue")
const config = require("../config")

//Models
const  ListenerStatus = require("../models/ListenerStatus")

function logEvents (events, chain, contractType) {
  events.forEach((data) => {
    if (data.event === 'Transfer') { // ERC721
      console.log("New transfer event for ERC721 token:", data.returnValues.tokenId)
      delete data.signature
      addTransfer({
        ...data,
        chain,
        fromAddress: data.returnValues.from,
        toAddress: data.returnValues.to,
        tokenId: data.returnValues.tokenId,
        tokenAddress: data.address,
        contractType
      })
    } else if (data.event === 'TransferSingle') { // ERC1155
      console.log("TransferSingle event for ERC1155 token:", data.returnValues.id)
      delete data.signature
      addTransfer({
        ...data,
        chain,
        fromAddress: data.returnValues.from,
        toAddress: data.returnValues.to,
        tokenId: data.returnValues.id,
        value: data.returnValues.value,
        tokenAddress: data.address,
        contractType
      })
    } else if (data.event === 'TransferBatch') { // ERC1155
      console.log("TransferBatch event for ERC1155 tokens:", data.returnValues.ids)
      delete data.signature
      const baseData = {
        ...data,
        chain, 
        fromAddress: data.returnValues.from, 
        toAddress: data.returnValues.to,
        tokenAddress: data.address,
        contractType
      }
      data.returnValues.ids.forEach((id, i) => {
        addTransfer({
          ...baseData,
          tokenId: id,
          value: data.returnValues.values[i]
        })
      })
    }
  })
}

module.exports = async (collection) => {
  try {
    const Provider = GetProvider(collection.chain)
    let contract

    if (collection.contractType === 'ERC721' || !collection.contractType) {
      contract = new Provider.eth.Contract(ABI_ERC721, collection.address)
    } else if (collection.contractType === 'ERC1155') {
      contract = new Provider.eth.Contract(ABI_ERC1155, collection.address)
    }

    const contractType = collection.contractType || 'ERC721'

    let startBlock;

    const listenerStatus = await ListenerStatus.findOne({ 
      chain :collection.chain,
      id: "collection:"+collection.address
    })
    if (!listenerStatus) {
       startBlock = await Provider.eth.getBlockNumber()
       listenerStatus.chain =  collection.chain
       listenerStatus.blockNumber = startBlock
       listenerStatus.id = "collection:"+collection.address
       await listenerStatus.save()
    } else {
      startBlock = listenerStatus.blockNumber
    }

    

    setInterval(async () => {
      const currentBlock = await Provider.eth.getBlock('latest')
      if (currentBlock.number > startBlock) {
        const events = await contract.getPastEvents('allEvents', {
          fromBlock: startBlock,
          toBlock: currentBlock.number
        })

        if (events?.length) logEvents(events, collection.chain, contractType)

        listenerStatus.blockNumber = currentBlock.number + 1
        await listenerStatus.save()

      }
    }, config.listener.interval)
  } catch (error) {
    console.error(error)
  }
}

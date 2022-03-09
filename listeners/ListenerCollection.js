const ABI_ERC721 = require("../abis/ERC721.json")
const ABI_ERC1155 = require("../abis/ERC1155.json")
const GetProvider = require("../utils/ChainProvider")
const { addTransfer } = require("../queue/Queue")

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

    const listener = contract.events.allEvents({
      fromBlock: 'latest'
    })

    listener.on('connected', () => {
      console.log("Setup listener for", collection.name)
    })

    listener.on('error', (error) => {
      console.error({ code: error.code, reason: error.reason })
    })

    listener.on('data', (data) => {
      if (data.event === 'Transfer') { // ERC721
        console.log("New transfer event for ERC721 token:", data.returnValues.tokenId)
        delete data.signature
        addTransfer({
          ...data,
          chain: collection.chain,
          fromAddress: data.returnValues.from,
          toAddress: data.returnValues.to,
          tokenId: data.returnValues.tokenId,
          tokenAddress: data.address,
          contractType
        })
      } else if (data.event === 'TransferSingle') { // ERC1155
        delete data.signature
        addTransfer({
          ...data,
          chain: collection.chain,
          fromAddress: data.returnValues.from,
          toAddress: data.returnValues.to,
          tokenId: data.returnValues.id,
          value: data.returnValues.value,
          tokenAddress: data.address,
          contractType
        })
      } else if (data.event === 'TransferBatch') { // ERC1155
        delete data.signature
        const baseData = {
          ...data,
          chain: collection.chain, 
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
  } catch (error) {
    console.error(error)
  }
}

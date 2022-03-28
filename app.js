require("dotenv").config()
const PORT = process.env.PORT || 5001

const express = require("express")
const axios = require("axios")
const app = express()

app.listen(PORT, () => {
  // Setup Marketplace Listener
  require("./listeners/ListenerMarketplaceHttp")()

  // Setup Listeners for whitelisted collections
  axios.get(`${process.env.API_URL}/collections/all/whitelisted`).then((res) => {
    if (res.data?.length) {
      res.data.forEach((collection) => {
        require("./listeners/ListenerCollectionHttp")(collection)
      })
    }
  })
  console.log('Event Listener started on port', PORT)
})

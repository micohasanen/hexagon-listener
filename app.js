require("dotenv").config()
const PORT = process.env.PORT || 5001

const mongoose = require("mongoose")
const express = require("express")
const axios = require("axios")
const app = express()

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`)

  
const config = require("./config")

app.listen(PORT, () => {
  // Setup Marketplace Listener
  config.marketplaces.forEach((marketplace) => {
    require("./listeners/ListenerMarketplaceHttp")(marketplace)
  })

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

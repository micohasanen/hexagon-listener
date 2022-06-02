const mongoose = require("mongoose")

const ListenerCollectionSchema = mongoose.Schema({
  chain: {
    type: String,
    required: true
  },
  blockNumber: Number
}, { timestamps: true })

module.exports = mongoose.model('ListenerCollection', ListenerCollectionSchema)
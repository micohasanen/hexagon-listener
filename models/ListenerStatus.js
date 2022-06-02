const mongoose = require("mongoose")

const ListenerStatusSchema = mongoose.Schema({
  chain: {
    type: String,
    required: true
  },
  blockNumber: Number,
  id: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true })

module.exports = mongoose.model('ListenerStatus', ListenerStatusSchema)
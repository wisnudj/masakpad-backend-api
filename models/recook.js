const mongoose = require('mongoose')
const Schema = mongoose.Schema

var recookSchema = new Schema({

  urlImage: {
    type: String
  },

  content: {
    type: String,
    required: [true, 'Content is required']
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },

  like: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }],

  resep: {
    type: Schema.Types.ObjectId,
    ref: 'fotos'
  }
})

var recook = mongoose.model('recook', recookSchema)

module.exports = recook;

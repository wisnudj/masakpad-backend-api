const mongoose = require('mongoose');
const Schema = mongoose.Schema

var resepSchema = new Schema({

  title: {
    type: String,
    required: [true, 'Nama masakan harus dimasukkan']
  },

  urlImage: {
    type: String,
    required: [true, 'urlimage is required']
  },

  bahan: [{
    type: String,
    required: [true, 'bahan-bahan harus dituliskan']
  }],

  langkah: [{
    type: String,
    required: [true, 'langkah-langkah harus dituliskan']
  }],

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
  }]
})

var resep = mongoose.model('resep', resepSchema)

module.exports = resep;

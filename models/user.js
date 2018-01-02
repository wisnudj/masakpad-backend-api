const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

var userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },

  email: {
    type: String,
    unique: [true, 'Email has been used'],
    validate: {
      validator: function(str) {
        return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(str);
      }
    },
    required: [true, 'Email is required']
  },

  password: {
    type: String,
    unique: true,
    required: [true, 'Password is required']
  },

  pengikut: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }],

  createdAt: {
    type: Date,
    default: Date.now
  }
})

userSchema.pre('save', function(next) {
  const saltRounds = 10;
  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(this.password, salt);

  this.password = hash

  next()
})

userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was wisnu a duplicate key error'));
  } else {
    console.log(error.name)
    next(error);
  }
});

var user = mongoose.model('users', userSchema)

module.exports = user;

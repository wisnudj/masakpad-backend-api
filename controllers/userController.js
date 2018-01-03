require('dotenv').config

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


module.exports = {

  SignUp: (req, res) => {
    User
      .create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      })
      .then((user) => {
        res.status(201).send({
          SUCCESS: {
            name: user.name,
            email: user.email,
            pengikut: user.pengikut
          }
        })
      })
      .catch((err) => {
        console.log(err)
      })
  },

  SignIn: (req, res) => {
    User
      .findOne({
        email: req.body.email
      })
      .then((user) => {
        if(user) {
          var passwordIsValid = bcrypt.compareSync(req.body.password, user.password)

          if(passwordIsValid) {
            var payload = {
              _id: user._id,
              email: user.email,
              name: user.name,
              pengikut: user.pengikut
            }

            res.status(200).send({
              SUCCESS: {
                access_token: jwt.sign(payload, process.env.jwtsecret)
              }
            })
          } else {
            res.status(403).send({
              Failed: 'Password is wrong'
            })
          }
        } else {
          res.status(403).send({
            Failed: 'email is wrong'
          })
        }
      })
      .catch((err) => {
        res.status(400).send(err)
      })
  },

  Ikuti: (req, res) => {
    User
      .findOne({_id: req.params.id})
      .populate('pengikut')
      .exec((err, hasil) => {
        var index = hasil.pengikut.findIndex(function(elemen) {
          return elemen._id == req.header.decoded._id
        })

        if(index == -1) {
          User
            .findOne({_id: req.header.decoded._id})
            .then((user) => {
              hasil.pengikut.push(user)
              hasil.save(function(err) {
                res.status(200).send({
                  SUCCESS: hasil
                })
              })
            })
        } else {
          res.status(400).send({
            FAILED: {
              msg: 'Sudah pernah mengikuti'
            }
          })
        }
      })
  }
};

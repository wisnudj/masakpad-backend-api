require('dotenv').config
const Recook = require('../models/recook')
const User = require('../models/user')

// Imports the Google Cloud client library
const Storage = require('@google-cloud/storage');

// Creates a client
const storage = Storage({
  projectId: process.env.projectId,
  keyFilename: process.env.keyFilename
})

module.exports = {
  Create: (req, res) => {
    Recook.create({
      content: req.body.content,
      author: req.header.decoded._id,
      urlImage: req.file.cloudStoragePublicUrl,
      filename: req.file.gcsname,
      resep: req.body.resep_id
    })
    .then((result) => {
      Recook
        .findOne({_id: result._id})
        .populate('author')
        .populate('like')
        .exec((err, hasil) => {
          res.status(200).send({
            SUCCESS: hasil
          })
        })
    })
  },

  Read: (req, res) => {
    Recook
      .find()
      .populate('author')
      .populate('like')
      .exec((err, hasil) => {
        res.status(200).send({
          SUCCESS: hasil
        })
      })
  },

  ReadOne: (req, res) => {
    Recook
      .find({resep: req.params.id})
      .populate('author')
      .populate('like')
      .exec((err, hasil) => {
        if(err) {
          res.status(400).send({
            FAILED: err
          })
        }
        res.status(200).send({
          SUCCESS: hasil
        })

      })
  },

  Like: (req, res) => {
    Recook
      .findOne({_id: req.params.id})
      .populate('author')
      .populate('like')
      .exec((err, hasil) => {
        var index = hasil.like.findIndex(function(elemen) {
          return elemen._id == req.header.decoded._id
        })

        if(index == -1) {
          User
            .findOne({_id: req.header.decoded._id})
            .then((user) => {
              hasil.like.push(user)
              hasil.save(function(err) {
                if(err) {
                  res.status(400).send({
                    FAILED: err
                  })
                }
                res.status(200).send({
                  SUCCESS: hasil
                })
              })
            })
        }
        else {
          hasil.like.splice(index, 1)
          hasil.save(function(err) {
            if(err) {
              res.status.send({
                FAILED: err
              })
            }

            res.status.send({
              SUCCESS: hasil
            })
          })
        }
      })
  },

  Delete: (req, res) => {
    Recook
      .findOne({_id: req.params.id})
      .then((recook) => {
        storage.bucket(process.env.CLOUD_BUCKET).file(recook.filename).delete().then(() => {
          Recook.deleteOne({_id: req.params.id}).then((deleterecook) => {
            res.status(200).send({
              SUCCESS: recook
            })
          })
        })
      })
  }
};

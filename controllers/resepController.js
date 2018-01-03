require('dotenv').config
var Resep = require('../models/resep')
var Recook = require('../models/recook')
var User = require('../models/user')
// Imports the Google Cloud client library
const Storage = require('@google-cloud/storage');

// Creates a client
const storage = Storage({
  projectId: process.env.projectId,
  keyFilename: process.env.keyFilename
})


module.exports = {
  Create: (req, res) => {
    Resep
      .create({
        urlImage: req.file.cloudStoragePublicUrl,
        filename: req.file.gcsname,
        title: req.body.title,
        bahan: req.body.bahan,
        langkah: req.body.langkah,
        author: req.header.decoded._id
      })
      .then((result) => {
        Resep
          .findOne({_id: result._id})
          .populate('author')
          .populate('like')
          .exec((err, hasil) => {
            res.status(200).send({
              SUCCESS: hasil
            })
          })

      })
      .catch((err) => {
        console.log(err)
      })
  },

  Read: (req, res) => {
    Resep
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
    Resep
      .find({author: req.params.id})
      .populate('author')
      .populate('like')
      .exec((err, hasil) => {
        res.status(200).send({
          SUCCESS: hasil
        })
      })
      .catch((err) => {
        res.status(404).send(err)
      })
  },

  Like: (req, res) => {
    Resep
      .findOne({_id: req.params.id})
      .populate('author')
      .populate('like')
      .exec((err, hasil) => {
        var index = hasil.like.findIndex(function(elemen) {
          console.log(elemen._id)
          return elemen._id == req.header.decoded._id
        })
        if(index == -1) {
          User
            .findOne({_id: req.header.decoded._id})
            .then((user) => {
              hasil.like.push(user)
              hasil.save(function(err) {
                res.send({
                  SUCCESS: hasil
                })
              })
            })
        } else {
          hasil.like.splice(index, 1)
          hasil.save(function(err) {
            res.send({
              SUCCESS: hasil
            })
          })
        }
      })
  },

  Delete: (req, res) => {
    Resep
      .findOne({_id: req.params.id})
      .then((resep) => {
        console.log(resep)
        storage.bucket('cobaaja').file(resep.filename).delete().then(() => {
          console.log('success')
          Resep.deleteOne({_id: req.params.id}).then((hasil) => {
            Recook.find({resep: resep._id}).then((recook) => {
              if(!recook) {
                res.send({
                  SUCCESS: resep
                })
              } else {
                var fotodelete = []

                recook.forEach((elemen) => {
                  fotodelete.push(storage.bucket('cobaaja').file(elemen.filename).delete())
                })

                Promise.all(fotodelete).then(() => {
                  Recook.remove({resep: resep._id}).then((hapusrecook) => {
                    res.send({
                      SUCCESS: resep
                    })
                  })
                })
              }
            })
          })
        })
      })
  }
};

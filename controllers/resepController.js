var Foto = require('../models/resep')
var User = require('../models/user')

module.exports = {
  Create: (req, res) => {
    Foto
      .create({
        urlImage: req.file.cloudStoragePublicUrl,
        status: req.body.status,
        bahan: req.body.bahan,
        langkah: req.body.langkah,
        author: req.body.author
      })
      .then((result) => {
        Foto
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
    Foto
      .find()
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

  ReadOne: (req, res) => {
    Foto
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
    Foto
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
      .catch((err) => {
        res.status(400).send(err)
      })
  }
};

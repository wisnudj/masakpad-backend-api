const Comment = require('../models/recook')
const User = require('../models/user')

module.exports = {
  Create: (req, res) => {
    Comment.create({
      content: req.body.content,
      author: req.header.decoded.id,
      urlImage: req.file.cloudStoragePublicUrl,
      resep: req.body.resep
    })
    .then((result) => {
      Comment
        .findOne({_id: result._id})
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
        .catch((err) => {
          res.status(404).send({
            FAILED: err
          })
        })
    })
    .catch((err) => {
      res.status(404).send({
        FAILED: err
      })
    })
  },

  Read: (req, res) => {
    Comment
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
    Comment
      .find({author: req.params.id})
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
      .catch((err) => {
        res.status(404).send({
          FAILED: err
        })
      })
  },

  Like: (req, res) => {
    Comment
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
  }
};

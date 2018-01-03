require('dotenv').config
const Storage = require('@google-cloud/storage')
const Multer = require('multer');
const CLOUD_BUCKET = "cobaaja";

const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
})

const storage = Storage({
  projectId: process.env.projectId,
  keyFilename: process.env.keyFilename
})
const bucket = storage.bucket(CLOUD_BUCKET)

const getPublicUrl = (filename) => {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`
}

const sendUploadToGCS = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const gcsname = Date.now() + req.file.originalname;
  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname;
    file.makePublic().then(() => {
      req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
      req.file.gcsname = gcsname
      next();
    });
  });

  stream.end(req.file.buffer);
}

module.exports = {
  sendUploadToGCS,
  multer,
  getPublicUrl
};

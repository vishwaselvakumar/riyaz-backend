// config/serviceCardstorage.js
const multer=require('multer')
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');
const Url = process.env.ATLAS_URL;

let gfs;

const initializeGFS = (db) => {
  gfs = Grid(db, mongoose.mongo);
  gfs.collection('servicecard'); // Collection name for images
};

const storage = new GridFsStorage({
  url: Url,
  file: (req, file) => {
    return {
      bucketName: 'servicecard',
      filename: file.originalname,
    };
  },
});

const upload = multer({ storage });

module.exports = { upload, initializeGFS, gfs };

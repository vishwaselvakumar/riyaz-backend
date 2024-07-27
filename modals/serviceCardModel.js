const mongoose = require('mongoose');

const serviceCardSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // image: {
  //   type: String,
  //   required: true,
  // },
  imageurl: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const ServiceCard = mongoose.model('ServiceCard', serviceCardSchema);

module.exports = ServiceCard;

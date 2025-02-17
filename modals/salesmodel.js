// contactModel.js
const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  // captcha: { type: String, required: true },
  companyname: { type: String },
}, {
  timestamps: true, // This option adds `createdAt` and `updatedAt` fields automatically
});

const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;

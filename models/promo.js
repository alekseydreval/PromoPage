var mongoose = require('mongoose');

var promo = new mongoose.Schema({
  title: String,
  body: String,
  backgroundImage: String
});

module.exports = promo;

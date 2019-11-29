const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  path: { type: String }
});

const Image = mongoose.model('image', ImageSchema);

module.exports = Clan;
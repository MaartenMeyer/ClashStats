const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  img: {
    data: Buffer,
    contentType: String
  },
  contentType: {
    type: String
  }
});

const Image = mongoose.model('image', ImageSchema);

module.exports = Image;
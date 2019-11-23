const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BaseSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Base needs to have a title']
  },
  url: {
    type: String,
    required: [true, 'Base needs to have a link']
  },
  image: {
    type: String,
    data: Buffer
  }
});

BaseSchema.set('toJSON', { virtuals: true });

const Base = mongoose.model('base', BaseSchema);

module.exports = Base;
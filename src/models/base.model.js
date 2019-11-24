const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BaseSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Base needs to have a title']
  },
  url: {
    type: String,
    required: [true, 'Base needs to have a link'],
    match: [/^(http|https):\/\/link[.]clashofclans[.]com\/[a-z]{2}\?action=OpenLayout&id=TH/, 'is invalid'],
  },
  image: {
    contentType: String,
    data: Buffer
  }
});

BaseSchema.set('toJSON', { virtuals: true });

const Base = mongoose.model('base', BaseSchema);

module.exports = Base;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClanSchema = new Schema({
  clanId: {
    type: String,
    immutable: true,
    unique: true,
    required: [true, 'Clan needs to have an id'],
    index: true
  },
  name: {
    type: String,
    immutable: true,
    required: [true, 'Clan needs to have a name']
  },
  description: {
    type: String,
    required: [true, 'Clan needs to have a description']
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Clan needs to have a creator']
  },
  image: {
    type: String
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'player'
  }],
  messages: [{
    type: String
  }]
});

ClanSchema.set('toJSON', { virtuals: true });

const Clan = mongoose.model('clan', ClanSchema);

module.exports = Clan;
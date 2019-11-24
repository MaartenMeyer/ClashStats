const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  playerId: {
    type: String,
    immutable: true,
    unique: true,
    required: [true, 'Player needs to have an id'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Player needs to have a name']
  },
  level: {
    type: Number,
    default: 0,
    required: [true, 'Player needs to have a level']
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Player needs to have a creator']
  },
  bases: [{
    type: Schema.Types.ObjectId,
    ref: 'base'
  }],
  clan: {
    type: Schema.Types.ObjectId,
    ref: 'clan'
  }
});

PlayerSchema.set('toJSON', { virtuals: true });

PlayerSchema.pre('remove', function (next) {
  const Base = mongoose.model('base');
  Base.remove({ _id: { $in: this.bases } })
    .then(() => next());
});

const Player = mongoose.model('player', PlayerSchema);

module.exports = Player;
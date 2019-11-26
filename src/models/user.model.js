const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Name is required.'],
    validate: {
      validator: (name) => name.length > 3,
      message: 'Name must be longer than 3 characters.'
    },
    index: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'Email is required.'],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true
  },
  hash: {
    type: String,
    required: true
  }
});

UserSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('user', UserSchema);

module.exports = User;
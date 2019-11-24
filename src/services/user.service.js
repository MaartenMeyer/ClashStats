const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/app.config');
const User = require('../models/user.model');

module.exports = {
  async authenticate ({ username, password }) {
    const user = await User.findOne({ username });
    if(user && bcrypt.compareSync(password, user.hash)) {
      const { hash, ...userRest } = user.toObject();
      const token = jwt.sign({ data: user.id }, config.jwtKey);
      return { ...userRest, token };
    } else {
      throw { status: 401, message: 'Invalid username or password' };
    }
  },

  async getById(id) {
    return await User.findById(id).select('-hash');
  },

  async create(body) {
    if (await User.findOne({ username: body.username })){
      throw { status: 409, message: `Username ${body.username} is already taken.` };
    }

    const user = new User(body);
    if (body.password) {
      user.hash = bcrypt.hashSync(body.password, 10);
    }
    await user.save();
  },

  async delete(id) {
    await User.findByIdAndRemove(id);
  }
}
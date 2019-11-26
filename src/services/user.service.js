const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/app.config');
const User = require('../models/user.model');

module.exports = {
  async authenticate ({ email, password }) {
    const user = await User.findOne({ email });
    if(user && bcrypt.compareSync(password, user.hash)) {
      const { hash, ...userRest } = user.toObject();
      const token = jwt.sign({ data: user.id }, config.jwtKey);
      return { ...userRest, token };
    } else {
      throw { status: 401, message: 'Invalid email or password' };
    }
  },

  async getById(id) {
    return await User.findById(id).select('-hash');
  },

  async create(body) {
    if (await User.findOne({ email: body.email })){
      throw { status: 409, message: `Email ${body.email} is already taken.` };
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
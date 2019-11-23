const Player = require('../models/player.model');
const User = require('../models/user.model');

module.exports = {
  async createPlayer(body, userId) {
    if (await Player.findOne({ playerId: body.playerId })) {
      throw `Player with id ${body.playerId} already exists.`;
    }
    const user = await User.findById(userId);
    if (user === null) {
      throw `User not found`;
    }

    await new Player({
      'playerId': body.playerId,
      'name': body.name,
      'level': body.level,
      'creator': user
    }).save();
  },

  async getAllPlayers() {
    return await Player.find();
  },

  async getPlayerById(id) {
    return await Player.findOne({ playerId: id });
  },

  async updatePlayerById(id, name, userId) {
    const player = await Player.findOne({ playerId: id });
    if (player === null) {
      throw `Player not found`;
    }
    if (player.creator.toString() === userId.toString()) {
      return await player.updateOne({ $set: { 'name': name } });
    } else {
      throw `Not authorised to update this user`
    }
  },

  async deletePlayerById(id, userId) {
    const player = await Player.findOne({ playerId: id });
    if (player === null) {
      throw `Player not found`;
    }
    if (player.creator.toString() === userId.toString()) {
      return await player.deleteOne();
    } else {
      throw `Not authorised to delete this user`
    }
  }
}
const Player = require('../models/player.model');
const User = require('../models/user.model');
const Clan = require('../models/clan.model');
const Base = require('../models/base.model');

module.exports = {
  async createPlayer(body, userId) {
    if (await Player.findOne({ playerId: body.playerId })) {
      throw { status: 409, message: `Player with id ${body.playerId} already exists.` };
    }
    const user = await User.findById(userId);
    if (user === null) {
      throw { status: 204, message: 'User not found' };
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
    const player = await Player.findOne({ playerId: id })
      .populate({
        path: 'bases',
        model: 'base',
        select: '-__v'
      })
      .populate({
        path: 'clan',
        model: 'clan',
        select: '-__v -messages -description'
      })
      .populate({
        path: 'creator',
        model: 'user',
        select: '-__v -email -hash'
      });
    if (player === null) {
      throw { status: 204, message: 'Player not found' };
    } else {
      return player;
    }
  },

  async updatePlayerById(id, name, userId) {
    const player = await Player.findOne({ playerId: id });
    if (player === null) {
      throw {}
    }
    if (player.creator.toString() === userId.toString()) {
      return await player.updateOne({ $set: { 'name': name } });
    } else {
      throw { status: 401, message: 'Not authorised to update this player' };
    }
  },

  // Only deletes player if the userId matches the player creator
  async deletePlayerById(id, userId) {
    const player = await Player.findOne({ playerId: id });
    if (player === null) {
      throw { status: 204, message: 'Player not found' };
    }
    console.log(player)
    if (player.creator.toString() === userId.toString()) {
      await Clan.updateOne(
        { _id: player.clan },
        { $pull: { members: player._id } }
      );
      return await player.deleteOne();
    } else {
      throw { status: 401, message: 'Not authorised to delete this player' };
    }
  }
}
const Clan = require('../models/clan.model');
const User = require('../models/user.model');
const Player = require('../models/player.model');
const fs = require('fs');

module.exports = {
  async createClan(body, userId, imageUrl) {
    if (await Clan.findOne({ clanId: body.clanId })) {
      const filepath = `.${imageUrl.split("api").pop()}`
      fs.unlink(filepath, async function (err) {
        if (err) throw err;
      });
      throw { status: 409, message: `Clan with id ${body.clanId} already exists.` };
    }
    const user = await User.findById(userId);
    if(user === null){
      throw { status: 204, message: 'User not found' };
    }

    await new Clan({
      'clanId': body.clanId,
      'name': body.name,
      'description': body.description,
      'creator': user,
      'image': imageUrl
    }).save();
  },

  async getAllClans() {
    return await Clan.find();
  },

  async getClanById(id) {
    const clan = await Clan.findOne({ clanId: id})
      .populate({
        path: 'members',
        model: 'player',
        select: '-creator -__v -clan -bases'
      });
    if(clan === null){
      throw { status: 204, message: 'Clan not found'};
    } else {
      return clan;
    }
  },

  async updateClanById(id, description, userId) {
    const clan = await Clan.findOne({ clanId: id });
    if(clan === null){
      throw { status: 204, message: 'Clan not found' };
    }
    if (clan.creator.toString() === userId.toString()) {
      return await clan.updateOne({ $set: { 'description': description }});
    } else {
      throw { status: 403, message: 'Not authorised to update this clan' };
    }
  },

  async deleteClanById(id, userId) {
    const clan = await Clan.findOne({ clanId: id });
    if (clan === null) {
      throw { status: 204, message: 'Clan not found' };
    }
    if(clan.creator.toString() === userId.toString()){
      const filepath = `.${clan.image.split("api").pop()}`
      fs.unlink(filepath, async function(err) {
        if(err) throw err;

        await Player.updateMany(
          { clan: clan.id },
          { $unset: { clan: true } }
        );

        return await clan.deleteOne()
      });
    } else {
      throw { status: 403, message: 'Not authorised to delete this clan' };
    }
  },

  async addPlayerToClan(id, playerId, userId) {
    const clan = await Clan.findOne({ clanId: id });
    if (clan === null) {
      throw { status: 204, message: 'Clan not found' };
    }
    const player = await Player.findOne({ playerId: playerId });
    if(player === null){
      throw { status: 204, message: 'Player not found' };
    }

    if (player.creator.toString() === userId.toString()) {
      await Clan.updateOne(
        { _id: clan.id },
        { $addToSet: { members: player }}
      );
      return await Player.updateOne(
        { _id: player.id },
        { $set: { clan: clan }}
      );
    } else {
      throw { status: 403, message: 'Not authorised to add this player to a clan' };
    }
  },

  async getAllPlayersFromClan(id) {
    const clan = await Clan.findOne({ clanId: id })
      .populate({
        path: 'members',
        model: 'player',
        select: '-creator -__v -clan -bases'
      });
    if (clan === null) {
      throw { status: 204, message: 'Clan not found' };
    } else {
      return clan;
    }
  },

  async removePlayerFromClan(id, playerId, userId) {
    const clan = await Clan.findOne({ clanId: id });
    if (clan === null) {
      throw { status: 204, message: 'Clan not found' };
    }
    const player = await Player.findOne({ playerId: playerId });
    if (player === null) {
      throw { status: 204, message: 'Player not found' };
    }

    // Only removes player if the userId matches the player creator or the clan creator
    if (player.creator.toString() === userId.toString() || clan.creator.toString() === userId.toString()) {
      await Clan.updateOne(
        { _id: clan.id },
        { $pull: { members: player._id } }
      );
      return await Player.updateOne(
        { _id: player.id },
        { $unset: { clan: true } }
      );
    } else {
      throw { status: 403, message: 'Not authorised to remove this player from a clan' };
    }
  },

}
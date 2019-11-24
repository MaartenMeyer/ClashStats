const Clan = require('../models/clan.model');
const User = require('../models/user.model');
const Player = require('../models/player.model');

module.exports = {
  async createClan(body, userId) {
    if (await Clan.findOne({ clanId: body.clanId })) {
      throw `Clan with id ${body.clanId} already exists.`;
    }
    const user = await User.findById(userId);
    if(user === null){
      throw `User not found`;
    }

    await new Clan({
      'clanId': body.clanId,
      'name': body.name,
      'description': body.description,
      'creator': user
    }).save();
  },

  async getAllClans() {
    return await Clan.find();
  },

  async getClanById(id) {
    return await Clan.findOne({ clanId: id});
  },

  async updateClanById(id, description, userId) {
    const clan = await Clan.findOne({ clanId: id });
    if(clan === null){
      throw `Clan not found`;
    }
    if (clan.creator.toString() === userId.toString()) {
      return await clan.updateOne({ $set: { 'description': description }});
    } else {
      throw `Not authorised to update this clan`
    }
  },

  async deleteClanById(id, userId) {
    const clan = await Clan.findOne({ clanId: id });
    if (clan === null) {
      throw `Clan not found`;
    }
    if(clan.creator.toString() === userId.toString()){
      return await clan.deleteOne();
    } else {
      throw `Not authorised to delete this clan`
    }
  },

  async addPlayerToClan(id, playerId, userId) {
    const clan = await Clan.findOne({ clanId: id });
    if (clan === null) {
      throw `Clan not found`;
    }
    const player = await Player.findOne({ playerId: playerId });
    if(player === null){
      throw `Player not found`;
    }

    if (player.creator.toString() === userId.toString()) {
      var conditions = {
        _id: id,
        'members.id': { $ne: 'something' }
      };
      console.log(clan.members._id)
      await Clan.updateOne(
        { _id: clan.id },
        { $addToSet: { members: player }}
      );
      return await Player.updateOne(
        { _id: player.id },
        { $set: { clan: clan }}
      );
    } else {
      throw `Not authorised to add this player to a clan`
    }
  },

  async removePlayerFromClan(id, playerId, userId) {
    const clan = await Clan.findOne({ clanId: id });
    if (clan === null) {
      throw `Clan not found`;
    }
    const player = await Player.findOne({ playerId: playerId });
    if (player === null) {
      throw `Player not found`;
    }

    // Only removes player if the userId matches the player creator or the clan creator
    if (player.creator.toString() === userId.toString() || clan.creator.toString() === userId.toString()) {
      await Clan.updateOne(
        { _id: clan.id },
        { $pull: { members: { _id: player.id } } }
      );
      return await Player.updateOne(
        { _id: player.id },
        { $set: { clan: {} } }
      );
    } else {
      throw `Not authorised to add this player to a clan`
    }
  },

}
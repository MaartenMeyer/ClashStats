const Clan = require('../models/clan.model');
const User = require('../models/user.model');
const Player = require('../models/player.model');
const Image = require('../models/image.model');
const fs = require('fs');

module.exports = {
  async createClan(body, userId, imageUrl, imageType) {
    if (await Clan.findOne({ clanId: body.clanId })) {
      throw { status: 409, message: `Clan with id ${body.clanId} already exists.` };
    }
    const user = await User.findById(userId);
    if(user === null){
      throw { status: 404, message: 'User not found' };
    }

    const image = new Image();
    image.img.data = fs.readFileSync(imageUrl);
    image.img.contentType = imageType

    image.save()
      .then(async function () {
        await new Clan({
          'clanId': body.clanId,
          'name': body.name,
          'description': body.description,
          'creator': user,
          'image': image
        }).save();
      })
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
      throw { status: 404, message: 'Clan not found'};
    } else {
      return clan;
    }
  },

  async updateClanById(id, description, userId) {
    const clan = await Clan.findOne({ clanId: id });
    if(clan === null){
      throw { status: 404, message: 'Clan not found' };
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
      throw { status: 404, message: 'Clan not found' };
    }
    if(clan.creator.toString() === userId.toString()){
      await Player.updateMany(
        { clan: clan.id },
        { $unset: { clan: true } }
      );

      await Image.findByIdAndDelete(clan.image);

      return await clan.deleteOne()
    } else {
      throw { status: 403, message: 'Not authorised to delete this clan' };
    }
  },

  async addPlayerToClan(id, playerId, userId) {
    const clan = await Clan.findOne({ clanId: id });
    if (clan === null) {
      throw { status: 404, message: 'Clan not found' };
    }
    const player = await Player.findOne({ playerId: playerId });
    if(player === null){
      throw { status: 404, message: 'Player not found' };
    }

    if (player.creator.toString() === userId.toString()) {
      if(player.clan !== null) {
        await Clan.updateOne(
          { _id: player.clan },
          { $pull: { members: player._id } }
        );
      }
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
      throw { status: 404, message: 'Clan not found' };
    } else {
      return clan;
    }
  },

  async removePlayerFromClan(id, playerId, userId) {
    const clan = await Clan.findOne({ clanId: id });
    if (clan === null) {
      throw { status: 404, message: 'Clan not found' };
    }
    const player = await Player.findOne({ playerId: playerId });
    if (player === null) {
      throw { status: 404, message: 'Player not found' };
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
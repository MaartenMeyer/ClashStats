const Clan = require('../models/clan.model');
const User = require('../models/user.model');

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
  }
}
const Player = require('../models/player.model');
const Base = require('../models/base.model');
const User = require('../models/user.model');
const Image = require('../models/image.model');
const fs = require('fs');

module.exports = {
  async addBaseToPlayer(id, body, userId, imageUrl, imageType) {
    const player = await Player.findOne({ playerId: id });
    if (player === null) {
      throw { status: 404, message: 'Player not found' };
    }

    const user = await User.findById(userId);
    if (user === null) {
      throw { status: 404, message: 'User not found' };
    }

    if (player.creator.toString() === userId.toString()) {
      const image = new Image();
      image.img.data = fs.readFileSync(imageUrl);
      image.img.contentType = imageType

      image.save()
        .then(async function () {
          const base = await new Base({
            'title': body.title,
            'link': body.link,
            'creator': user,
            'image': image
          }).save();

          await Player.updateOne(
            { _id: player.id },
            { $addToSet: { bases: base } }
          );
        })
    } else {
      throw { status: 403, message: 'Not authorised to add a base to this player' };
    }
  },

  async deleteBaseById(id, userId) {
    const base = await Base.findById(id);
    if (base === null) {
      throw { status: 404, message: 'Base not found' };
    }
    if (base.creator.toString() === userId.toString()) {
      await Player.updateOne(
        { _id: base.creator },
        { $pull: { bases: base._id } }
      );

      await Image.findByIdAndDelete(base.image);

      return await base.deleteOne();
    } else {
      throw { status: 403, message: 'Not authorised to delete this base' };
    }
  }
}
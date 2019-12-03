const Image = require('../models/image.model');

module.exports = {
  async getImageById(id) {
    const image = await Image.findById(id);
    if(image === null) {
      throw { status: 404, message: 'Image not found' };
    } else {
      return image;
    }
  }
}
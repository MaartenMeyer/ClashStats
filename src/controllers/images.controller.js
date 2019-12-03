const assert = require('assert');
const imageService = require('../services/image.service');

module.exports = {
  getImageById: (req, res, next) => {
    try {
      assert.equal(typeof req.params.id, "string", "Image id is required.");
      const imageId = req.params.id;

      imageService.getImageById(imageId)
        .then((image) => {
          res.setHeader('Content-Type', image.img.contentType);
          res.send(image.img.data);
        })
        .catch((error) => next(error));
    } catch (e) {
      return res.status(422).send({
        message: e.toString()
      });
    }
  }
}
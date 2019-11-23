const assert = require('assert');
const userService = require('../services/user.service');

module.exports = {
  authenticateUser: (req, res, next) => {
    try {
      assert.equal(typeof req.body.username, "string", "A valid username is required.");
      assert.equal(typeof req.body.password, "string", "A valid password is required.");

      userService.authenticate(req.body)
        .then((user) => {
          res.json(user);
        })
        .catch(error => next(error));
    } catch (e) {
      return res.status(422).send({
        message: e.toString()
      });
    }
  },
  registerUser: (req, res, next) => {
    try {
      assert.equal(typeof req.body.username, "string", "A valid username is required.");
      assert.equal(typeof req.body.email, "string", "A valid email is required.");
      assert.equal(typeof req.body.password, "string", "A valid password is required.");

      userService.create(req.body)
        .then(() => {
          res.status(200).send({
            message: 'User registered'
          });
        })
        .catch((error) => next(error));
    } catch (e) {
      return res.status(422).send({
        message: e.toString()
      });
    }
  }
}
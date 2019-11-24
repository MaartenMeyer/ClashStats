module.exports = errorHandler;

function errorHandler(err, req, res, next) {
  if((err.name) === 'Error') {
    return res.status(err.status).json({ message: err.message });
  }

  if (err.name === 'ValidationError') {
    return res.status(422).json({ message: err.message });
  }

  if (err.name === 'AuthenticationError') {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  if(err.name === 'MongoError') {
    return res.status(400).json({ message: err.errmsg });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: err });
  }

  if (typeof (err) === 'object') {
    return res.status(err.status).json({ message: err.message })
  }

  return res.status(500).json({ message: err.message });
}
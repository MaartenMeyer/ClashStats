module.exports = errorHandler;

function errorHandler(err, req, res, next) {
  if (typeof (err) === 'string') {
    if(err.message === 'AuthenticationError'){
      return res.status(401).json({ message: 'Invalid username or password' });
    } else {
      return res.status(400).json({ message: err });
    }
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === 'AuthenticationError') {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid Token' });
  }

  return res.status(500).json({ message: err.message });
}
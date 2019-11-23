require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const logger = require('./src/config/app.config').logger;

var env = process.env.NODE_ENV || 'development';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

mongoose.Promise = global.Promise;

// Entry point of all requests
app.all("*", (req, res, next) => {
  const { method, url } = req;
  logger.info(`${method} ${url}`);
  next();
});

// 1. Enable CORS
// 2. Allow POST, GET, PUT, PATCH, DELETE & OPTIONS
// 3. Allow specified headers to be sent in request
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,PATCH,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  next();
});

// Error handler if no matching endpoint found.
app.all("*", (req, res, next) => {
  const { method, url } = req;
  const errorMessage = `${method} ${url} does not exist.`;
  const errorObject = {
    message: errorMessage,
    code: 404,
    date: new Date()
  };
  next(errorObject);
});

// Error handler.
app.use((error, req, res, next) => {
  logger.error("Error handler: ", error.message.toString());
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).send({
      message: "Bad request"
    });
  }
  res.status(error.code).json(error);
});

app.listen(port, '0.0.0.0', () => logger.info("Server is listening on port 3000"));

module.exports = app;
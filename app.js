require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('./src/helpers/jwt');
const errorHandler = require('./src/helpers/error-handler');
const logger = require('./src/config/app.config').logger;

var env = process.env.NODE_ENV || 'development';
let config;
if (env === 'development') {
  config = require('./src/config/mongodb.config').development;
} else if (env === 'test') {
  config = require('./src/config/mongodb.config').test;
} else {
  config = require('./src/config/mongodb.config').production;
}

const app = express();
const imagesRoutes = require('./src/routes/images.routes');
const authenticationRoutes = require('./src/routes/authentication.routes');
const clansRoutes = require('./src/routes/clans.routes');
const playersRoutes = require('./src/routes/players.routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(jwt());

mongoose.Promise = global.Promise;

// Log if running on development or production
if (app.get('env') === 'development') {
  logger.info("Connecting to local database...");
} else if (app.get('env') === 'test') {
  logger.info("Connecting to test database...");
} else {
  logger.info("Connecting to remote database...");
}
// Connection to database
mongoose.connect(config.url, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  logger.info("Successfully connected to the database.");
}).catch(err => {
  logger.error("Database connection error: ", err.message.toString());
  process.exit();
});

// Entry point of all requests
app.all("*", (req, res, next) => {
  const { method, url } = req;
  logger.info(`${method} ${url}`);
  next();
});

// // 1. Enable CORS
// // 2. Allow POST, GET, PUT, PATCH, DELETE & OPTIONS
// // 3. Allow specified headers to be sent in request
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,PATCH,DELETE');
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
//   next();
// });
//app.use('/api/images', express.static('images'));
app.use('/api', imagesRoutes);
app.use('/api', authenticationRoutes);
app.use('/api', clansRoutes);
app.use('/api', playersRoutes);

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
app.use(errorHandler);
// app.use((error, req, res, next) => {
//   logger.error("Error handler: ", error.message.toString());
//   if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
//     return res.status(400).send({
//       message: "Bad request"
//     });
//   }
//   res.status(error.code).json(error);
// });

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => logger.info("Server is listening on port 3000"));

module.exports = app;
'use strict';

require('dotenv').config();

// Start up DB Server
const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

//Connect to the Mongo DB
try {
  mongoose.connect(process.env.MONGODB_URI, options);

  const server = require('./source/server/server');

  // Start the web server
  server.start(process.env.PORT);
}
catch (error) {
  console.error('Could not start up server: ', error);
}

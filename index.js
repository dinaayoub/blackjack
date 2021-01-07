'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./source/routes/routes');

app.use(routes);

const PORT = process.env.PORT;



const server = require('./source/server/server');
server.start(PORT);

//this is where the discord bot code goes
//for now we will call stuff manually from here

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  },
};

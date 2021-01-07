'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');

// Prepare the express app
const app = express();
app.use(cors());

// routes and middleware
const routes = require('../routes/routes');
const logger = require('../middleware/logger');

// Routes
app.use(routes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', logger, (req, res) => {
  res.status(200).send('hi there');
});

// Catchalls

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      if (!port) { throw new Error("Missing Port"); }
      console.log(`Server up on ${port}`);
    });
  },
};







'use strict';

const express = require('express');
const app = express();

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  },
};
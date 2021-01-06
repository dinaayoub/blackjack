'use strict';

const mongoose = require('mongoose');

const users = new mongoose.Schema({
  userID: { type: String, required: true, unique: true },
  name: { type: String /*, required: true */ },
  pushes: { type: Number, required: true, default: 0 },
  wins: { type: Number, required: true, default: 0 },
  losses: { type: Number, required: true, default: 0 },
  bank: { type: Number, required: true, default: 500 },
});

const userModel = mongoose.model('users', users)
module.exports = userModel;
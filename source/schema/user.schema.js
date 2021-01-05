'use strict';

const mongoose = require('mongoose');

const users = new mongoose.Schema({
  userID: { type: String, required: true, unique: true },
  wins: { type: Number, required: true, default: 0},
  losses: {type: Number, required: true, default: 0},
  bank: {type: Number, required: true, default: 0},
});

module.exports = users;
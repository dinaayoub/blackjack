'use strict';

const express = require('express');
const Users = require('../schema/user.schema');

// essentially update 
async function leaveGameHandler(req, res) {
  // will need to be updated per discord.js logic 
  const obj = req.body; 
  const userID = req.params.userID;
  Users.findAndUpdate({userID: { $eq: userID}}, obj);
}

module.exports = leaveGameHandler;
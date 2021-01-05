'use strict';

const express = require('express');
const Users = require('../schema/user.schema');


// essentially update 
async function leaveGameHandler(req, res) {
  // will need to be updated per discord.js logic 
  let name = req.body.name; 
  let bank = req.body.bank + req.body.earnings;
  const userID = req.params.userID;
  Users.findAndUpdate({userID: { $eq: userID}}, {name, bank});
}

module.exports = leaveGameHandler;
'use strict';

const express = require('express');
const Users = require('../schema/user.schema');


// essentially update 
async function updatePlayer(player) {
  // will need to be updated per discord.js logic 
  let bank = player.bank;
  let wins = player.currentWins;
  let losses = player.currentLosses;
  let pushes = player.currentPushes;
  let record = await Users.findAndUpdate({userID: { $eq: player.id}}, {bank, wins, losses, pushes});
  return record;
}

module.exports = updatePlayer;
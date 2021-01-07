'use strict';

// const express = require('express');
const Users = require('../schema/user.schema');
// const Discord = require('discord.js')
// const client = new Discord.Client();
// const user = client.user.id;


// get an existing player record 
async function getPlayer(player) {
  // console.log('PLAYER = ', player);
  let record = await Users.findOne({ userid: player.userID });
  // console.log('RETURNED RECORD = ', record);

  // checks if user already exists in db 
  if (!record) {
    // if not we will call addNewPlayer to the db
    record = await addNewPlayer(player);
    // console.log('added RECORD = ', record);
  }

  return record; // this might not return in a proper format
}

// create a new player record 
async function addNewPlayer(player) {
  // a new player is saved only with their userID and name
  let newRecord = new Users({ userid: player.userID, name: player.name });
  // console.log('NEW RECORD = ', newRecord);
  var savedRecord = await newRecord.save();
  // console.log(savedRecord);
  return savedRecord;
}

module.exports = getPlayer;
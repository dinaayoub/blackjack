'use strict';

// const express = require('express');
const Users = require('../schema/user.schema');
// const Discord = require('discord.js')
// const client = new Discord.Client();
// const user = client.user.id;


// get an existing player record 
async function getPlayer(player) {
  let record;
  // checks if user already exists in db 
  if (Users.find({ userID: player.id }).count() > 0) {
    // if so we will find and save the user to record 
    record = await Users.findOne({ userID: player.id });
    console.log('retrieved RECORD = ', record);
  } else {
    // if not we will call addNewPlayer to the db
    record = await addNewPlayer(player);
    console.log('added RECORD = ', record);
  }
  console.log('RECORD = ', record);
  return JSON.parse(record); // this might not return in a proper format
}


// create a new player record 
async function addNewPlayer(player) {
  // a new player is saved only with their userID and name
  let newRecord = new Users({ userID: player.id, name: player.name });
  console.log('NEW RECORD = ', newRecord);
  return await newRecord.save();
}

module.exports = getPlayer;
'use strict';

// const express = require('express');
const Users = require('../schema/user.schema');
// const Discord = require('discord.js')
// const client = new Discord.Client();
// const user = client.user.id;


// get an existing player record 
async function joinGameHandler(req, res) {
  let userID = req.params.userID; // this will need to be translated to discord.js friendly lingo
  let record;
  // checks if user already exists in db 
  if(Users.find({userID: userID}).count() > 0) {
    record = await Users.findOne({userID});
  } else {
    addNewPlayer();
  }
  res.status(200).json(record);
}


// create a new player record 
async function addNewPlayer(req, res) {
  let newRecord = new Users(req.body);
  return newRecord.save();
}

module.exports = joinGameHandler;
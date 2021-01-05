'use strict';

const express = require('express');
const Users = require('../schema/user.schema');
// const Discord = require('discord.js')
// const client = new Discord.Client();
// const user = client.user.id;



async function joinGameHandler(req, res) {
  // TODO check if user already exists 
  let userID = req.params.userID; // this will need to be translated to discord.js friendly lingo
  let record = Users.findOne({userID});
  // TODO: logic to send back to the application needed?
  res.status(200).json(record);
}

module.exports = joinGameHandler;
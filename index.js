'use strict';

require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(MONGODB_URI, options);


const server = require('./source/server/server');
server.start(PORT);

const Dealer = require('./source/dealer');

//this is where the discord bot code goes
//for now we will call stuff manually from here

var dealer = new Dealer();
dealer.addPlayer('dina');
dealer.addPlayer('owais');
console.log("PLAYERS: ", dealer.players);
for (let i = 0; i < 100; i++) {
  dealer.next();
}


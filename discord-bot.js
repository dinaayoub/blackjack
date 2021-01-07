'use strict';

require('dotenv').config();
const Dealer = require('./source/dealer');
var dealer = new Dealer();
const {Client} = require('discord.js');

const bot = new Client();

const PREFIX = '!';


// message.channel.send == global message to channel from bot

// functions will be [ !function arg arg ]

const MONGODB_URI = process.env.MONGODB_URI;

const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

mongoose.connect(MONGODB_URI, options);



bot.on('ready', () =>{
  console.log(`${bot.user.tag}`);
});

bot.on('message', (message) =>{

  if(message.author.bot) return;
  if(message.content.startsWith(PREFIX)){
    const [cmdName, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
    if(cmdName === 'start'){
      dealer.start();
      console.log('dealer.players = ', dealer.players);
      let names = dealer.players.map(players => players.name);
      let id = dealer.players.map(player => player.id);
      message.channel.send(`Welcome ${names} `);
      message.channel.send('Round starting...');
      id.forEach(id => message.member.id);
    }
    if(cmdName === 'join'){
      console.log(message.author);
      let name = message.author.username;
      dealer.addPlayer(message.author.id, name);
      message.reply(`welcome ${message.author} to the Table`);
    }
    if(cmdName === 'bet') {
      if(args.length === 0){message.reply('place at least min bet');}

      dealer.bet(args[1]);
      message.reply(`${args[1]} bet placed`);
    }
    if(cmdName === 'hit'){
      dealer.hit();

      // this route for count may need changing ????
      message.reply(`here is one card your count is ${dealer.round.player.count}`);
    }
    if(cmdName === 'stand'){
      dealer.stand();
      message.reply('ok ill move on');
    }
    if(cmdName === 'buyIn'){
      dealer.buyIn();
      message.reply('bank replenished');
    }
    if(cmdName === 'leave'){
      dealer.removePlayer(message.author);
      message.channel.send(`${message.author} left the game`);
    }

    
    // TODO: add any other commands
  }
  // get the messages from chat
  console.log(`[${message.author.tag}]: ${message.content}`);

  // listen for key words or string
  if (message.content ==='test') {

    // send a response to chat when hearing the string
    message.reply(`bot test occured`);
  }
});

bot.login(process.env.BOT_TOKEN);

module.exports = bot;
'use strict';

require('dotenv').config();
const Dealer = require('./source/dealer');
var dealer;// = new Dealer();
const { Client } = require('discord.js');
const superagent = require('superagent');

const bot = new Client();

const PREFIX = '!';

// message.channel.send == global message to channel from bot

// functions will be [ !function arg arg ]

bot.on('ready', () => {
  //dealer = new Dealer();

  console.log(`${bot.user.tag}`);

  superagent.get('http://localhost:3000/next')
    .then(results => {
      console.log(results);
    })
    .catch(error => {
      console.error(error);
    });
});


bot.on('message', (message) => {

  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    const [cmdName, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
    if (cmdName === 'play' || cmdName === 'help') {
      message.channel.send('Ready to play blackjack? Type !join to join the game');
      //send the list of rules
      //or the list of commands
    }
    if (cmdName === 'start') {
      dealer.next();
      message.channel.send(`Welcome ${dealer.players}. Type !bet to make your bet.`);
    }
    if (cmdName === 'join') {
      console.log(message.author);
      //need error checking if the user is already on the table.
      dealer.addPlayer(message.author.id); //is this the right id to send? can we also update name/other properties?
      message.reply(`welcome to the table`);
    }
    if (cmdName === 'hit') {
      //we need error checking here to make sure the person saying hit is the one 
      //whose turn it is.
      dealer.next('hit');
      // this route for count may need changing ????
      message.reply(`here is one card your count is ${dealer.round.player.count}`);
    }
    if (cmdName === 'stand') {
      dealer.stand();
      message.reply('ok ill move on');
    }
    if (cmdName === 'buyIn') {
      dealer.buyIn();
      message.reply('bank replenished');
    }
    if (cmdName === 'leave') {
      dealer.removePlayer(message.author);
      message.channel.send(`${message.author} left the game`);
    }
    if (cmdName === 'bet') {
      if (args.length === 0) { message.reply('place at least min bet'); }

      dealer.bet(args[1]);
      message.reply(`${args[1]} bet placed`);
    }

    // TODO: add any other commands
  }
  // get the messages from chat
  console.log(`[${message.author.tag}]: ${message.content}`);

  // listen for key words or string
  if (message.content === 'test') {

    // send a response to chat when hearing the string
    message.reply(`bot test occured`);
  }
});

bot.login(process.env.BOT_TOKEN);
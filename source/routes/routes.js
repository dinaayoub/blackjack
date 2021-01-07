'use strict';

const express = require('express');
const router = express.Router();
const uuid = require('uuid').v4;
const Dealer = require('../dealer');
const dealers = [];
const logger = require('../middleware/logger');

router.get('/next/:dealerID', logger, nextHandler);
router.get('/next/:dealerID/:verb', logger, nextVerbHandler);
router.post('/join/:dealerID/:playerID', logger, joinHandler);
router.post('/leave/:dealerID/:playerID', logger, leaveHandler);
router.get('/game', logger, newGameHandler);

function newGameHandler(req, res) {
  console.log('in new game handler');
  var dealer = { id: uuid(), dealer: new Dealer() };
  dealers.push(dealer);
  res.status(200).json(dealer);
  console.log(dealers);
}

async function joinHandler(req, res) {
  let dealer = getDealer(req).dealer;
  let id = req.params.playerID;
  // console.log('req.params.id = ', id);
  await dealer.addPlayer(id);
  console.log(dealer);
  res.status(200).json(dealer.players[dealer.players.length - 1]);
}

async function leaveHandler(req, res) {
  let dealer = getDealer(req).dealer;
  let id = req.params.playerID;
  dealer.removePlayer(id);
  res.status(200).send(id);
}

async function nextHandler(req, res) {
  let dealer = getDealer(req).dealer;
  let next = dealer.next();
  res.status(200).json(next);
}

async function nextVerbHandler(req, res) {
  let dealer = getDealer(req).dealer;
  var verb = req.params.verb;
  //if the verb is bet, check if we also have an amount
  var amount = req.query.amount;
  let next = dealer.next(verb, amount ? amount : null);
  res.status(200).json(next);
}

function getDealer(req) {
  var dealerID = req.params.dealerID;
  var dealerContainer;
  //regular next
  dealerContainer = dealers.find((dealer) => {
    return dealer.id === dealerID;
  })
  return dealerContainer;
}
module.exports = router;
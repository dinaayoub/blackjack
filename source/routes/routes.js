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
  var id = uuid();
  const dealerObj = {
    id,
    dealer: new Dealer()
  };
  const minimizedDealer = getMinimizedDealer(dealerObj);
  dealers.push(dealerObj);
  res.status(200).json(minimizedDealer);
}

async function joinHandler(req, res) {
  let dealerContainer = getDealer(req);
  let playerID = req.params.playerID;
  await dealerContainer.dealer.addPlayer(playerID);
  res.status(200).json(getMinimizedDealer(dealerContainer));
}

async function leaveHandler(req, res) {
  let dealerContainer = getDealer(req);
  let id = req.params.playerID;
  await dealerContainer.dealer.removePlayer(id);
  res.status(200).json(getMinimizedDealer(dealerContainer));
}

async function nextHandler(req, res) {
  let dealerContainer = getDealer(req);
  await dealerContainer.dealer.next();
  res.status(200).json(getMinimizedDealer(dealerContainer));
}

async function nextVerbHandler(req, res) {
  let dealerContainer = getDealer(req);
  var verb = req.params.verb;
  //if the verb is bet, check if we also have an amount
  var amount = req.query.amount;
  await dealerContainer.dealer.next(verb, amount ? amount : null);
  res.status(200).json(getMinimizedDealer(dealerContainer));
}

function getMinimizedDealer(dealerContainer) {
  return {
    id: dealerContainer.id,
    dealer: {
      currentState: dealerContainer.dealer.currentState,
      currentPlayerIndex: dealerContainer.dealer.currentPlayerIndex,
      players: dealerContainer.dealer.players,
      round: dealerContainer.dealer.round
    }
  };
}

function getDealer(req) {
  var dealerID = req.params.dealerID;
  var dealerContainer = dealers.find((dealer) => {
    return dealer.id === dealerID;
  })
  return dealerContainer;
}

module.exports = router;
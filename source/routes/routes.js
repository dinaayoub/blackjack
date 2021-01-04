'use strict';

const express = require('express');
const router = express.Router();

const dealer = require('../dealer');

router.get('/deal', dealHandler);
router.get('/hit', hitHandler);
router.get('/stand', standHandler);
router.get('/next', nextHandler);

function dealHandler(req, res){
//   console.log('params', req.params, 'body', req.body);
//   let obj = req.body;
  let deal = dealer.deal();
  res.status(200).json(deal);
}

function hitHandler(req, res){
  //get
  // this will give the player one card
  let id = req.body.userID;
  let hit = dealer.hit(id);
  res.status(200).json(hit);
}

function standHandler(req, res){
  //get
  //this will have the player stop receiving cards
  // req.body.id or req.params.id
  let id = req.body.userID;
  let stand = dealer.stand(id);
  res.status(200).json(stand);
}

function nextHandler(req, res){
  // get (currently)
  // awaiting additional information from the dealer.js page
//   let obj = req.body;
  let next = dealer.next();
  res.status(200).json(next);
}

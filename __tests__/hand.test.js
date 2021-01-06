'use strict';

const Card = require('../source/card');
const Hand = require('../source/hand');
const Player = require('../source/player');

describe('Hand Object', () => {
  var player = new Player('23457');
  player.name = 'Bob';
  player.bank = 350;
  var hand = new Hand(player);
  var card = new Card('9', 'S');
  var card2 = new Card('A', 'C');
  var card3 = new Card('5', 'H');
  var card4 = new Card('K', 'D');

  it('Can create a new hand object', () => {
    expect(hand).toEqual({
      cards: [],
      player: player,
      bet: 0,
      status: 'active'
    });
  });

  it('Can add a card to a hand', () => {
    hand.addCard(card);
    console.log(hand.count);
    expect(hand).toEqual({
      cards: [card],
      player: player,
      bet: 0,
      status: 'active',
    });
  });

  it('Can add multiple cards to a hand', () => {
    hand.addCard(card2);
    hand.addCard(card3);
    expect(hand).toEqual({
      cards: [card, card2, card3],
      player: player,
      bet: 0,
      status: 'active',
    });
  });
});

describe('Handcount Object', () => {
  var player = new Player('23457');
  player.name = 'Bob';
  player.bank = 350;
  var hand = new Hand(player);
  var card = new Card('K', 'S');
  var card2 = new Card('A', 'C');
  var card3 = new Card('7', 'H');


  it('Can get the count of a hand with a face', () => {
    hand.addCard(card);
    var count = hand.totalHandCount();
    console.log('in test HO card1', count);
    hand.count = count;
    expect(hand.count).toEqual(10);
  });
  it('Can get the count of a hand with a face and ace', () => {
    hand.addCard(card2);
    var count = hand.totalHandCount();
    hand.count = count;
    console.log('in test HO card2', count);
    expect(hand.count).toEqual(21);
  });
  it('Can get the count of a hand with a face and ace and number', () => {
    hand.addCard(card3);
    var count = hand.totalHandCount();
    console.log('in test HO card3', count);
    hand.count = count;
    expect(hand.count).toEqual(18);
  });
});
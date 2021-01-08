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

  it('Can create a new hand object', () => {
    expect(hand).toEqual({
      cards: [],
      player: player,
      bet: 0,
      status: 'active',
    });
  });

  it('Can add a card to a hand', () => {
    hand.addCard(card);
    expect(hand).toEqual({
      cards: [card],
      player: player,
      bet: 0,
      status: 'active',
      count: 9,
    });
  });

  it('Can add multiple cards to a hand', () => {
    hand.addCard(card2);
    hand.addCard(card3);
    expect(hand).toEqual({
      cards: [card, card3, card2],
      player: player,
      bet: 0,
      status: 'active',
      count: 15,
    });
  });
});

describe('Handcount Object', () => {
  var player = new Player('23457');
  player.name = 'Bob';
  player.bank = 350;
  var hand = new Hand(player);
  var card = new Card('K', 'S');
  var card2 = new Card('7', 'C');
  var card3 = new Card('A', 'H');


  it('Can get the count of a hand with a face (K/Q/J)', () => {
    hand.addCard(card);
    expect(hand.count).toEqual(10);
  });

  it('Can get the count of a blackjack hand with a face (K/Q/J) and an ace', () => {
    hand.addCard(card2);
    expect(hand.count).toEqual(17);
  });

  //we should probably think of a better scenario to test than this because 
  //this would never happen (having blackjack then saying hit). 
  it('Can get the count of a hand with a face (K/Q/J) and ace and number', () => {
    hand.addCard(card3);
    expect(hand.count).toEqual(18);
  });
});

describe('Handcount Object doubble ace', () => {
  var player = new Player('23457');
  player.name = 'Bob';
  player.bank = 350;
  var hand = new Hand(player);
  var card = new Card('A', 'S');
  var card2 = new Card('A', 'C');
  var card3 = new Card('7', 'H');


  it('properly counts 2 aces and a card', () => {
    hand.addCard(card);
    hand.addCard(card2);
    hand.addCard(card3);
    expect(hand.count).toEqual(19);
  });
});

'use strict';

const Card = require('../source/card');
const Hand = require('../source/hand');
const Player = require('../source/player');

describe('Hand Object', () => {
  var player = new Player('23457');
  player.name = 'Bob';
  player.bank = 350;
  var hand = new Hand(player);
  var card = new Card('10', 'S');
  var card2 = new Card('A', 'C');
  var card3 = new Card('5', 'H');
  var card4 = new Card('6', 'D');

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
    expect(hand).toEqual({
      cards: [card],
      player: player,
      bet: 0,
      status: 'active'
    });
  });

  it('Can add multiple cards to a hand', () => {
    hand.addCard(card2);
    hand.addCard(card3);
    expect(hand).toEqual({
      cards: [card, card2, card3],
      player: player,
      bet: 0,
      status: 'active'
    });
  });

  it('Can get the count of a hand', () => {
    // hand.addCard(card4);
    // var count = hand.totalHandCount();
    // hand.count = count;
    // expect(hand.count).toEqual(21);
  });
});
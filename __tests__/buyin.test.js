'use strict';

const Dealer = require('../source/dealer');
const Player = require('../source/player');

describe('buyin',() =>{
  var dealer = new Dealer();
  var player1 = new Player('1111');
  var player2 = new Player('2222');
  player1.bank = 1;
  player2.bank = 5000;

  it('Can ask low bank players to buyin before start of hand', () => {
    dealer.addPlayer('1111');
    dealer.addPlayer('2222');
    dealer.start();
    expect(dealer.buyIn()).toBeCalled();
  });
});
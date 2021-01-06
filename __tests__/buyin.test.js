'use strict';

const Dealer = require('../source/dealer');
const Player = require('../source/player');

xdescribe('buyin',() =>{
  var dealer = new Dealer();
  var player1 = new Player('1111');
  player1.bank = 2;
  var player2 = new Player('2222');
  player2.bank = 500;
  console.log('players in build player phaze', player1, player2);
  it('Can ask low bank players to buyin before start of hand', () => { 
    dealer.addPlayer(player1.id);
    dealer.start();
    expect(dealer.buyIn()).toBeCalled();
  });
});
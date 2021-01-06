'use strict';

const Player = require('../source/player');

describe('Player Object', () => {

  it('Can create a new player object', () => {
    var player = new Player('23457');
    player.name = 'Bob';
    player.bank = 350;
    player.currentPushes = 0;
    player.currentWins = 0;
    player.currentLosses = 0;
    player.earnings = 50;

    expect(player).toEqual({
      userID: '23457',
      name: 'Bob',
      bank: 350,
      earnings: 50,
      currentWins: 0,
      currentLosses: 0,
      currentPushes: 0,
    });
  });
});
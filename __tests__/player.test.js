'use strict';

const Player = require('../source/player');

describe('Player Object', () => {

  it('Can create a new player object', () => {
    var player = new Player('23457');
    player.name = 'Bob';
    player.bank = 350;

    expect(player).toEqual({
      id: '23457',
      name: 'Bob',
      bank: 350
    })
  });
});
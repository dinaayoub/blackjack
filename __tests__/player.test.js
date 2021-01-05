const Player = require('../source/player');

describe('Player Object', () => {

  it('Can create a new player object', () => {
    var player = new Player('abcdefg');
    expect(player).toEqual({
      id: 'abcdefg',
      name: '',
      bank: 500
    })
  });
});
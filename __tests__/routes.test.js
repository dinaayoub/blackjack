'use strict';

const supergoose = require('@code-fellows/supergoose');
const { server } = require('../index');
const Dealer = require('../source/dealer');
const Shoe = require('../source/shoe');
const Player = require('../source/player');
// const Player = require('../source/player');
const mockRequest = supergoose(server);

// let users = {
//     player:
//     admin:
// }

describe('Blackjack', () => {
//   let player = {id:'1',name:'Bob',bank:500};
//   console.log('this is the player', player);
//   let dealer = new Dealer();
//   dealer.addPlayer('1');
  it('can deal', async () => {
    // let dealer = new Dealer();
    const res = await mockRequest.get('/next');
    expect(res.status).toBe(200);

  });
});

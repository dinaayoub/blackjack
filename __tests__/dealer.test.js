'use strict';
const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};
const Dealer = require('../source/dealer');
//const updatePlayer = require('../source/middleware/update');
const Card = require('../source/card');

describe('Dealer Object', () => {
  var dealer = new Dealer();
  // var mockUpdate;

  beforeAll(async (done) => {
    // mockUpdate = jest.fn().mockImplementation(updatePlayer);
    await mongoose.connect(global.__MONGO_URI__, options, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
    done();
  });

  afterAll((done) => {
    mongoose.connection.close();
    // mockUpdate.mockRestore();
    done();
  });

  it('Can create a new dealer object', () => {
    expect(dealer.currentState).toEqual('start');
    expect(dealer.round.length).toEqual(0);
    expect(dealer.currentPlayerIndex).toEqual(0);
  });

  it('Can correctly throw an error if we try to start a game without any players', () => {
    expect(() => {
      dealer.start();
    }).toThrow();
  });

  it('Can add a player to the game for next round', async () => {
    await dealer.addPlayer('1');
    await dealer.addPlayer('2');
    expect(dealer.players.length).toBe(2);
    expect(dealer.round.length).toBe(0);
  });

  it('Can start a game using the start function', async () => {
    dealer.start();
    expect(dealer.round.length).toEqual(3);
    expect(dealer.currentState).toEqual('bets');
    expect(dealer.currentPlayerIndex).toEqual(0);
  });

  it('Can place bets for all non-dealers players', async () => {
    dealer.bet(25);
    dealer.bet(50);
    expect(dealer.round[0].bet).toStrictEqual(25);
    expect(dealer.round[1].bet).toStrictEqual(50);
    expect(dealer.round[2].bet).toStrictEqual(0); //dealer's bet should always be 0
    expect(dealer.currentState).toStrictEqual('deal');
  });

  it('Can remove a player from the game for next round', async () => {
    dealer.players[0].bank = 300;
    await dealer.removePlayer('1');
    expect(dealer.players.length).toBe(1);
    await dealer.addPlayer('1');
    expect(dealer.players[1].bank).toBe(300);
    //need to validate that the player is updated correctly in the db?
  });

  it('Can deal a hand to each player', async () => {
    await dealer.deal();
    expect(dealer.round[0].cards.length).toEqual(2);
    expect(dealer.round[1].cards.length).toEqual(2);
    expect(dealer.round[2].cards.length).toEqual(2);
  });

  it('Can hit - add a card to the current Player\'s hand', () => {
    dealer.hit();
    expect(dealer.round[0].cards.length).toEqual(3);
  });

  it('Can stand - stop adding cards to the player\'s hand on hit', () => {
    dealer.stand();
    dealer.hit();
    dealer.hit();
    dealer.stand();
    expect(dealer.round[0].cards.length).toEqual(3);
    expect(dealer.round[1].cards.length).toEqual(4);
    expect(dealer.round[2].cards.length).toEqual(2);
  })

  it('Can successfully have dealer follow the rules when it\'s their turn', async () => {
    console.log('RANDOM dealer count = ', dealer.round[2].count);
    if (dealer.round[2].count < 17) {
      dealer.dealerTurn();
      expect(dealer.round[2].cards.length).toBeGreaterThan(2);
    } else if (dealer.round[2].count === 21) {
      dealer.dealerTurn();
      expect(dealer.round[2].status).toEqual('blackjack');
    } else if (dealer.round[2].count >= 17 && dealer.round[2].count < 21) {
      dealer.dealerTurn();
      expect(dealer.round[2].status).toEqual('stand');
    }
    expect(dealer.currentState).toEqual('payout');
  });

  it('Can payout players correctly', () => {

  })

});
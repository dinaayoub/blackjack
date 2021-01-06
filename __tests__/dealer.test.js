'use strict';
const mongoose = require('mongoose');
const Dealer = require('../source/dealer');

describe('Dealer Object', () => {
  var dealer = new Dealer();

  beforeAll(async (done) => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
    done();
  });

  afterAll((done) => {
    mongoose.connection.close();
    done();
  });

  it('Can create a new dealer object', () => {
    expect(dealer.currentState).toEqual('start');
    expect(dealer.round.length).toEqual(0);
    expect(dealer.currentPlayerIndex).toEqual(0);
  });

  it('Can correctly throw an error if we try to start a game without any players', () => {
    expect(() => {
      dealer.start()
    }).toThrow();
  });


  it('Can start a game using the start function', async (done) => {
    await dealer.addPlayer('1');
    await dealer.addPlayer('2');
    dealer.start();
    expect(dealer.round.length).toEqual(3);
    expect(dealer.currentState).toEqual('bets');
    expect(dealer.currentPlayerIndex).toEqual(0);
    done();
  });

  it('Can place bets for all non-dealers players', async (done) => {
    dealer.bet(25);
    dealer.bet(50);
    expect(dealer.round[0].bet).toStrictEqual(25);
    expect(dealer.round[1].bet).toStrictEqual(50);
    expect(dealer.round[2].bet).toStrictEqual(0); //dealer's bet should always be 0
    expect(dealer.currentState).toStrictEqual('deal');
    done();
  });

});
'use strict';
const mongoose = require('mongoose');
const Dealer = require('../source/dealer');


describe('buyin',() =>{
  let spy;

  beforeAll(async (done) => {
    spy = jest.spyOn(dealer, 'buyIn').mockImplementation();
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

  var dealer = new Dealer();
  it('Can ask low bank players to buyin before start of hand', async() => { 
    await dealer.addPlayer('1111');
    dealer.players[0].bank = 3;
    dealer.start();

    expect(spy).toBeCalled();
  });
});
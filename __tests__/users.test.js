'use strict';

//test the database operations
const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

const getPlayer = require('../source/database-operations/join');
const updatePlayer = require('../source/database-operations/update');
const Player = require('../source/player');
const userData = new Player('5');
userData.name = 'hello';

describe('User Model Test', () => {

  // It's just so easy to connect to the MongoDB Memory Server 
  // By using mongoose.connect
  beforeAll(async (done) => {
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
    done();
  });

  it('Can create & save a new user', async () => {
    var user = await getPlayer(userData);
    expect(user.userid).toEqual(userData.userID);
    // Object Id should be defined when successfully saved to MongoDB.
    expect(user._id).toBeDefined();
    expect(user.userid).toBe(userData.userID);
    expect(user.name).toBe(userData.name);
  });

  it('Can retrieve an existing user', async () => {
    var existingUser = await getPlayer(userData);
    expect(existingUser.userid).toEqual(userData.userID);
  });

  it('Can update a player', async () => {
    userData.name = 'world';
    userData.bank += 100;
    var updatedPlayer = await updatePlayer(userData);
    expect(updatedPlayer.name).toEqual(userData.name);
    expect(updatedPlayer.bank).toEqual(userData.bank);
    expect(updatedPlayer.wins).toEqual(userData.currentWins);
    expect(updatedPlayer.losses).toEqual(userData.currentLosses);
    expect(updatedPlayer.pushes).toEqual(userData.currentPushes);
  });

})
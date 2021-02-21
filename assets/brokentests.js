/*'use strict';

const supertest = require('supertest');
const { server } = require('../index');
const mockRequest = supertest(server);
const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

describe('Routes', () => {
  async function removeAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      await collection.deleteMany();
    }
  }

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

  afterAll(async (done) => {
    await removeAllCollections();
    mongoose.connection.close();
    // mockUpdate.mockRestore();
    done();
  });

  it('Can start a game using the /game route', async () => {
    const result = await mockRequest.get('/game');
    console.log(result);
  });

  it('Can join a game using the /join route', async () => {
    //    const result = await mockRequest.post('/join/4512d');
    //  expect(result.status).toBe(200);

  });

  it('Can leave a game using the /leave route', () => {

  });

  it('Can start a game using the next route', () => {

  });

});*/
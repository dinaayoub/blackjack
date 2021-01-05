'use strict';

class Player {
  constructor(userID) {
    this.id = userID;
    this.name = '';
    this.bank = 500;
    this.earnings = 0;
    this.currentWins = 0;
    this.currentLosses = 0;
    this.currentPushes = 0;
  }
}
module.exports = Player;
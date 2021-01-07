'use strict';

class Player {
  constructor(userID, name) {
    this.userID = userID;
    this.name = name;
    this.bank = 500;
    this.earnings = 0;
    this.currentWins = 0;
    this.currentLosses = 0;
    this.currentPushes = 0;
  }
}
module.exports = Player;
# Software Requirements

## Vision

A Blackjack API that can be played through discord as a bot.

## Pain Point

To mitigate boredeom, computer fidgetiness and discord brownie points (a discord admin can set up a competition between their server members and the game).

## Why should you care?

If you are a content creator that uses discord to connect with otehrs, it will help you generate more content for your server. It helps with engagement.

## Scope

***IN (DOS):***

- Discord Bot
- Strictly blackjack
- Betting system  

***OUT (DON'TS):***

- Web App
- Other card game functionality

## Feature Tasks

***MVP:***

- Blackjack API with NoSQL storage
  - Dealer
  - Players
  - Shoe
  - Hand
  - Cards
- Heroku deployment

***STRETCH:***

- Discord bot integration
- Ability for server admin to disable the bot
- Double-down & split logic
- Role based access
- AWS deployment
- Authentication to hit API

## Functional Requirements

1. As a discord admin, I want to be able to add a bot to my server so that my server members can play blackjack
2. As a discord user, I want to be able to start a game
3. As a player, I want to be able to join an ongoing game and be dealt in at the start of the next hand
4. As a player, I want to be able to place a bet using the earnings from my “bank”
5. As a player, I want to be able to play an action (hit, stay, double-down, split) on my turn.
6. As a player, I want to be able to leave the game and cash out to my bank until I decide to play again.

## Data Flow

![data flow diagram](./assets/DataFlow401Midterm.png)

## Non-Functional Requirements

- *Testability:* we want 90% code coverage, CI/CD set up on GitHub, restrictive merging unless tests pass.
- *Usability:* clean documentation so that both tiers of our users can successfully use our product, account for user error.

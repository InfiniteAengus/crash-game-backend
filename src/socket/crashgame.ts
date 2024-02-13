import { SocketEventNames } from "../data/constants";
import { f, fixed } from "../utils/timeConverter";
// import GameHistoryModel from "../models/GameHistory";
// import BetHistoryModel from "../models/BetHistory";
// import UserModel, { User } from "../models/User";
import MersenneTwister from "mersenne-twister";
import { IPlayer } from "../types";
const randGenerator = new MersenneTwister();

var timeElapsed = 0;
var isRising = false;
var crashPoint = 0;
var crashTimeElapsed = 0;
var GameID = 0;

var players: IPlayer[] = [];

export const startNewRound = (io: any) => {
  const x = randGenerator.random();
  crashPoint = fixed(Math.max(1, 0.99 / (1 - x)), 2);
  isRising = true;
  timeElapsed = 0;
  GameID++;

  console.log(`Game ${GameID}: ${crashPoint}`);

  let timerId = setInterval(async () => {
    if (isRising && timeElapsed > 5 && f(timeElapsed) >= crashPoint) {
      isRising = false;
      crashTimeElapsed = 0;

      // broadcast event
    } else if (isRising) {
      timeElapsed += 0.1;
    } else {
      crashTimeElapsed += 4;
      // start a new round
      if (crashTimeElapsed >= 120) {
        clearInterval(timerId);
        startNewRound(io);
      }
    }
    sendStateInfo(io);
    // if (counter === 0) sendStateInfo(io);
    // counter = (counter + 1) % 5;
  }, 100);
};

export const sendStateInfo = (handler?: any) => {
  handler.emit(SocketEventNames.StateInfo, {
    gameState: getTimeState(),
  });
};

export const getTimeState = () => {
  return {
    timeElapsed,
    isRising,
    GameID,
    crashTimeElapsed,
  };
};

export const addPlayer = (newPlayer: IPlayer) => {
  players.push(newPlayer);
};

import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { addBet, addPlayer, cashOut, startNewRound } from "./crashgame";
import { Namespace } from "socket.io";
import { SocketEventNames } from "../data/constants";
import { IPlayer } from "../types";

interface Message {
  text: string;
  address: string;
  avatar: string;
  time: Date;
}

const socketProvider = (
  io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  startNewRound(io);
  io.on("connection", (socket) => {
    socket.on(SocketEventNames.NewUser, (player: IPlayer) => {
      console.info("New player: ", player);
      addPlayer(player);
    });
    socket.on(SocketEventNames.Bet, (playerId: string, betAmount: number) => {
      console.log("New bet: ", playerId, betAmount);
      addBet(playerId, betAmount);
    });
    socket.on(SocketEventNames.CashOut, (playerId: string) => {
      const cashOutAmount = cashOut(playerId);
      if (cashOutAmount) {
        io.emit(SocketEventNames.CashOut, playerId, cashOutAmount);
      }
      console.log("CashOut: ", playerId, cashOutAmount);
    });
  });
};
export default socketProvider;

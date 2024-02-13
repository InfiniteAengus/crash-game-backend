import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { addPlayer, startNewRound } from "./crashgame";
import { Namespace } from "socket.io";
import { SocketEventNames } from "../data/constants";
import { IPlayer } from "../types";

interface Message {
  text: string;
  address: string;
  avatar: string;
  time: Date;
}

const messages: Message[] = [];

const socketProvider = (
  io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  startNewRound(io);
  io.on("connection", (socket) => {
    socket.on(SocketEventNames.NewUser, (player: IPlayer) => {
      console.info("New player: ", player);
      addPlayer(player);
    });
  });
};
export default socketProvider;

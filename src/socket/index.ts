import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { startNewRound } from "./crashgame";
import { Namespace } from "socket.io";

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
    console.log("new user connected");
  });
};
export default socketProvider;

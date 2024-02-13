import {
  addPlayer,
  getPlayers,
  Cashout,
  addWaiting,
  removeWaitiong,
  startNewRound,
} from "./crashgame";

interface Message {
  text: string;
  address: string;
  avatar: string;
  time: Date;
}

const messages: Message[] = [];

const socketProvider = (io: any) => {
  startNewRound(io);
  io.on("connection", (socket: any) => {
    var auth = {
      token: "",
      user: {
        address: "",
        name: "",
        avatar: "",
        balance: {
          btc: 0,
          eth: 0,
          ltc: 0,
          egld: 0,
          kas: 0,
          erg: 0,
          xrp: 0,
          bnb: 0,
          usdc: 0,
          usdt: 0,
          matic: 0,
          ada: 0,
          sol: 0,
          ebone: 0,
        },
      },
    };
    socket.emit("playerState", getPlayers());
    socket.emit("auth");
    socket.emit("messages", messages);

    socket.on("auth", (data: any) => {
      auth = data.auth;
      socket.emit("messages", messages);
    });
    socket.on("bet", (data: any) => {
      if (data.address !== auth.user.address || data.address === "") return;
      addPlayer({
        ...auth.user,
        cashPoint: 0,
        betAmount: data.amount,
        autoCashOut: data.autoCashOut,
        chain: data.chain,
      });
    });
    socket.on("promise", (data: any) => {
      if (data.address !== auth.user.address || data.address === "") return;
      addWaiting({
        ...auth.user,
        cashPoint: 0,
        betAmount: data.amount,
        autoCashOut: data.autoCashOut,
        chain: data.chain,
      });
    });
    socket.on("cancelPromise", (data: any) => {
      if (data.address !== auth.user.address || data.address === "") return;
      removeWaitiong(data.address);
    });
    socket.on("cashOut", (data: any) => {
      if (data.address !== auth.user.address || data.address === "") return;
      Cashout(data.address);
    });
    socket.on("message", (data: any) => {
      const newMessage = {
        ...data,
        address: auth.user.address,
        avatar: auth.user.avatar,
        time: new Date(),
      };
      messages.push(newMessage);
      io.emit("message", newMessage);
    });
  });
};
export default socketProvider;

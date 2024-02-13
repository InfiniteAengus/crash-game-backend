import http from "http";
import express from "express";
import path from "path";
import cors from "cors";
import SocketIO from "socket.io";

// import router from "./src/routes";
import environment from "./src/configs/index";
import socketProvider from "./src/socket";
// import socketProvider from "./src/socket/index";

var app = express();
app.use(cors());
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const httpServer = new http.Server(app);
const io = new SocketIO.Server(httpServer, {
  cors: { methods: ["GET", "POST"] },
}).of("/crash");
socketProvider(io);
// app.use("/", router);

const port = environment.port || 4000;
httpServer.listen(port, () => console.log(`Server started on ${port}`));

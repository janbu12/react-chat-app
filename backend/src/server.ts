import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { setupWebSocket } from "./websocket";
import router from "./routes";

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use("/api", router); // Tambahkan route API

setupWebSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

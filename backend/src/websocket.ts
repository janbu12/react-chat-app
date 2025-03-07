import { Server as WebSocketServer } from "ws";
import { Server } from "http";
import { saveMessage } from "./models";

export const setupWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", async (data) => {
      try {
        const { sender_id, receiver_id, message } = JSON.parse(data.toString());

        // Simpan pesan ke database
        await saveMessage(sender_id, receiver_id, message);

        // Broadcast pesan ke semua client
        wss.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(JSON.stringify({ sender_id, receiver_id, message }));
          }
        });

      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
};

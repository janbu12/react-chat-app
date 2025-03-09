import { Server as WebSocketServer } from "ws";
import { Server } from "http";
import { saveMessage } from "./models";


const users = new Map<number, any>();

export const setupWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    console.log("Client connected");

    ws.on("message", (data) => {
      try {
        const parsedData = JSON.parse(data.toString());
        console.log(parsedData);

        // Jika data adalah pesan "register", simpan koneksi user
        if (parsedData.type === "register") {
          const userId = Number(parsedData.user_id);
          users.set(userId, ws);
          console.log(`User ${userId} connected`);
          return;
        }

        // Jika data adalah pesan chat
        const { sender_id, receiver_id, message } = parsedData;

        // Simpan pesan ke database
        saveMessage(sender_id, receiver_id, message);

        // Kirim pesan hanya ke penerima (receiver_id)
        const receiverSocket = users.get(receiver_id);
        if (receiverSocket) {
          receiverSocket.send(JSON.stringify({ sender_id, receiver_id, message }));
        }

        // Kirim pesan kembali ke pengirim agar muncul di UI mereka
        const senderSocket = users.get(sender_id);
        if (senderSocket) {
          senderSocket.send(JSON.stringify({ sender_id, receiver_id, message }));
        }

      } catch (error) {
        console.error("Error processing message:", error);
        ws.send(JSON.stringify({ error: "Invalid JSON format" }));
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      users.forEach((socket, userId) => {
        if (socket === ws) {
          users.delete(userId);
          console.log(`User ${userId} removed from active users`);
        }
      });
    });
  });
};

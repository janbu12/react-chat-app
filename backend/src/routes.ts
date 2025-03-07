import express from "express";
import { saveMessage, getMessages } from "./models";

const router = express.Router();

// Endpoint untuk mengambil chat antara dua pengguna
router.get("/messages/:sender/:receiver", async (req, res) => {
  const { sender, receiver } = req.params;
  try {
    const messages = await getMessages(parseInt(sender), parseInt(receiver));
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil pesan" });
  }
});

// Endpoint untuk mengirim pesan
router.post("/messages", async (req, res) => {
  const { sender_id, receiver_id, message } = req.body;
  try {
    await saveMessage(sender_id, receiver_id, message);
    res.json({ success: true, message: "Pesan dikirim!" });
  } catch (error) {
    res.status(500).json({ error: "Gagal mengirim pesan" });
  }
});

export default router;

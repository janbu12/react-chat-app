import pool from "./database";

// Menyimpan pesan ke database
export const saveMessage = async (sender_id: number, receiver_id: number, message: string) => {
  const query = "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)";
  await pool.execute(query, [sender_id, receiver_id, message]);
};

// Mengambil pesan antara dua pengguna
export const getMessages = async (sender_id: number, receiver_id: number) => {
  const query = `
    SELECT * FROM messages
    WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
    ORDER BY timestamp ASC
  `;
  const [rows] = await pool.execute(query, [sender_id, receiver_id, receiver_id, sender_id]);
  return rows;
};

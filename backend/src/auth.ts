import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "./database"; // Sesuaikan dengan koneksi MySQL Anda
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const SECRET_KEY: string = process.env.SECRET_KEY || "default_secret_key";

interface RegisterRequest extends Request {
    body: {
        username: string;
        password: string;
    };
}


// REGISTER USER
router.post("/register", async (req: RegisterRequest, res: any) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)", 
            [username, hashedPassword]
        );
        
        return res.status(201).json({ message: "User registered successfully" });
    } catch (error: any) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Username already exists" });
        }
        return res.status(500).json({ error: error.message });
    }
});


// LOGIN USER
router.post("/login", async (req: any, res: any) => {
    const { username, password } = req.body;

    try {
        const [users]: any = await pool.query("SELECT * FROM users WHERE username = ?", [username]);

        if (!Array.isArray(users) || users.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
        return res.json({ token, userId: user.id });
    } catch (error: any) {
        return res.status(500).json({ error: "Error logging in" });
    }
});

export default router;

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../config/db.js";

const COOKIE_NAME = "admin_token";

const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
};

const signToken = (user) =>
    jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

const setAuthCookie = (res, token) => {
    res.cookie(COOKIE_NAME, token, {
        ...cookieOptions,
        maxAge: 24 * 60 * 60 * 1000,
    });
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        const [existing] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            "INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)",
            [name, email, hashed, "admin", "active"]
        );

        const user = { id: result.insertId, name, email, role: "admin" };
        const token = signToken(user);

        setAuthCookie(res, token);
        res.status(201).json({ user });
    } catch (err) {
        res.status(500).json({ message: "Register failed", error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const [rows] = await db.query(
            "SELECT id, name, email, password, role FROM users WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = rows[0];
        const ok = await bcrypt.compare(password, user.password);

        if (!ok) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = signToken(user);
        setAuthCookie(res, token);

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
};

export const me = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user: rows[0] });
    } catch (err) {
        res.status(500).json({ message: "Failed to load user", error: err.message });
    }
};

export const logout = (req, res) => {
    res.clearCookie(COOKIE_NAME, cookieOptions);
    res.json({ message: "Logged out" });
};

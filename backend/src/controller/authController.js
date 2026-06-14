import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../config/db.js";
import {createUser, findUserByEmail, findUserById} from "../models/userModel.js";
import {generateAccessToken, generateRefreshToken} from "../utils/generateTokens.js";
import {hashToken} from "../utils/hashToken.js";
import {findRefreshToken, revokeToken, saveRefreshToken} from "../models/refreshTokenModel.js";

const COOKIE_NAME = "admin_token";

const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
};

export const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role = "author",
            status = "active",
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters",
            });
        }

        const allowedRoles = ["admin", "editor", "author"];
        const allowedStatuses = ["active", "inactive"];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role",
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status",
            });
        }

        const existing = await findUserByEmail(email);

        if (existing) {
            return res.status(409).json({
                message: "Email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = await createUser(
            name,
            email,
            hashedPassword,
            role,
            status
        );

        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: userId,
                name,
                email,
                role,
                status,
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(email);
        if (!user) return res.status(400).json({ message: "Invalid email" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Wrong password" });

        const payload = { id: user.id, email: user.email };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const hashed = await hashToken(refreshToken);

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await saveRefreshToken(user.id, hashed, expiresAt);

        res.cookie("refresh_token", refreshToken, cookieOptions);

        res.json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status },
            accessToken,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const refresh = async (req, res) => {
    try {
        const token = req.cookies.refresh_token;
        if (!token) return res.status(401).json({ message: "No refresh token" });

        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const hashed = await hashToken(token);
        const stored = await findRefreshToken(hashed);

        if (!stored || stored.revoked_at) {
            return res.status(401).json({message: "Invalid refresh token"});
        }
        if (new Date(stored.expires_at) < new Date()) {
            return res.status(401).json({message: "Expired refresh token"});
        }
        const user = await findUserById(decoded.id);

        const accessToken = generateAccessToken(user);

        res.json({ accessToken, user });
    } catch (err) {
        res.status(401).json({ message: "Refresh failed" });
    }
};

export const logout = async (req, res) => {
    try {
        const token = req.cookies.refresh_token;
        if (token) {
            const hashed = await hashToken(token);
            await revokeToken(hashed);
        }

        res.clearCookie("refresh_token");
        res.json({ message: "Logged out" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const me = async (req, res) => {
    const user = await findUserById(req.user.id);
    res.json(user);
};
;

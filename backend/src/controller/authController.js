import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../config/db.js";

const createAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "15m",
        }
    );
};

const createRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

const setAccessTokenCookie = (res, accessToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 15 * 60 * 1000,
    });
};

const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export const register = async (req, res) => {
    try {
        const { name, email, password , role , status } = req.body;
        console.log(name, email, password, role, status);
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const [existingUsers] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                message: "Email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO users (name, email,password,role,status) VALUES (?, ?, ?,?,?)",
            [name, email, hashedPassword, role, status],
        );

        res.status(201).json({
            message: "User registered successfully",
        });
    } catch (err) {
        res.status(500).json({
            message: "Register failed",
            error: err.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const user = users[0];

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);

        await db.query(
            "INSERT INTO user_tokens (user_id, refresh_token) VALUES (?, ?)",
            [user.id, refreshToken]
        );

        setAccessTokenCookie(res, accessToken);
        setRefreshTokenCookie(res, refreshToken);

        console.log('hii')
        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json({
            message: "Login failed",
            error: err.message,
        });
    }
};

export const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token missing",
            });
        }

        const [savedTokens] = await db.query(
            "SELECT * FROM user_tokens WHERE refresh_token = ?",
            [refreshToken]
        );

        if (savedTokens.length === 0) {
            return res.status(403).json({
                message: "Refresh token not found",
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const accessToken = jwt.sign(
            {
                id: decoded.id,
                email: decoded.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m",
            }
        );

        setAccessTokenCookie(res, accessToken);

        res.json({
            message: "Access token refreshed",
        });
    } catch (err) {
        res.status(403).json({
            message: "Invalid refresh token",
        });
    }
};

export const me = async (req, res) => {
    try {
        const [users] = await db.query(
            "SELECT id, name, email, created_at FROM users WHERE id = ?",
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.json({
            user: users[0],
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to get user",
            error: err.message,
        });
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            await db.query(
                "DELETE FROM user_tokens WHERE refresh_token = ?",
                [refreshToken]
            );
        }

        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        });

        res.json({
            message: "Logout successful",
        });
    } catch (err) {
        res.status(500).json({
            message: "Logout failed",
            error: err.message,
        });
    }
};
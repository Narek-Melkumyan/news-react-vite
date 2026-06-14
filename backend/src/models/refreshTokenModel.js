import db from "../../config/db.js";

export const saveRefreshToken = async (userId, tokenHash, expiresAt) => {
    await db.query(
        "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
        [userId, tokenHash, expiresAt]
    );
};

export const findRefreshToken = async (tokenHash) => {
    const [rows] = await db.query(
        "SELECT * FROM refresh_tokens WHERE token_hash = ?",
        [tokenHash]
    );
    return rows[0];
};

export const revokeToken = async (tokenHash) => {
    await db.query(
        "UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ?",
        [tokenHash]
    );
};
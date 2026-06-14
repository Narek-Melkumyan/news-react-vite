import db from "../../config/db.js";

export const findUserByEmail = async (email) => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
};

export const createUser = async (name, email, password,role,status) => {
    const [result] = await db.query(
        "INSERT INTO users (name, email, password,role,status) VALUES (?, ?, ?,?,?)",
        [name, email, password,role,status]
    );
    return result.insertId;
};

export const findUserById = async (id) => {
    const [rows] = await db.query(
        `SELECT id, name, email, role, status FROM users WHERE id = ? LIMIT 1`, [id]
    );

    return rows[0];
};
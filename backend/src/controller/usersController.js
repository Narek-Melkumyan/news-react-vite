import db from "../../config/db.js";

export const getUsers = async (req, res) => {
    try {
        const [users] = await db.query(`
      SELECT 
        id,
        name,
        email,
        role,
        status,
        created_at
      FROM users
      ORDER BY id DESC
    `);

        res.status(200).json({users,});
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Failed",
            error: err.message,
        });
    }
};


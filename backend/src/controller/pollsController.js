import db from "../../config/db.js";

export const getPolls = async (req, res) => {
    try {
        const [polls] = await db.query(`
            SELECT 
                p.id,
                p.question,
                p.status,
                p.start_date,
                p.end_date,
                COUNT(DISTINCT po.id) AS options_count,
                COUNT(pv.id) AS total_votes
            FROM polls p
            LEFT JOIN poll_options po ON p.id = po.poll_id
            LEFT JOIN poll_votes pv ON po.id = pv.option_id
            GROUP BY 
                p.id,
                p.question,
                p.status,
                p.start_date,
                p.end_date
            ORDER BY p.id DESC
        `);

        res.json({polls,});
    } catch (err) {
        res.status(500).json({
            message: "Failed to get polls",
            error: err.message,
        });
    }
};

export const addPoll = async (req, res) => {
    try {
        const { question, options, start_date, end_date, status } = req.body;

        if (!question) {
            return res.status(400).json({
                message: "Question is required",
            });
        }

        if (!options || !Array.isArray(options) || options.length < 2) {
            return res.status(400).json({
                message: "At least 2 options are required",
            });
        }

        const [pollResult] = await db.query(
            `INSERT INTO polls 
            (question, start_date, end_date, status)
            VALUES (?, ?, ?, ?)`,
            [
                question,
                start_date || null,
                end_date || null,
                status || "active",
            ]
        );

        const pollId = pollResult.insertId;

        for (const option of options) {
            if (option.trim() !== "") {
                await db.query(
                    "INSERT INTO poll_options (poll_id, option_text) VALUES (?, ?)",
                    [pollId, option]
                );
            }
        }

        res.status(201).json({
            message: "Poll created successfully",
            pollId,
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to create poll",
            error: err.message,
        });
    }
};
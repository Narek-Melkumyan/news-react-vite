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
                     LEFT JOIN poll_options po
                               ON p.id = po.poll_id
                     LEFT JOIN poll_votes pv
                               ON po.id = pv.option_id
            GROUP BY
                p.id,
                p.question,
                p.status,
                p.start_date,
                p.end_date
            ORDER BY p.id DESC
        `);

        res.json({
            polls,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Failed to get polls",
            error: err.message,
        });
    }
};


export const getPollById = async (req, res) => {
    try {
        const { id } = req.params;

        const [polls] = await db.query(
            `
                SELECT
                    id,
                    question,
                    status,
                    start_date,
                    end_date
                FROM polls
                WHERE id = ?
            `,
            [id]
        );

        if (polls.length === 0) {
            return res.status(404).json({
                message: "Poll not found",
            });
        }

        const [options] = await db.query(
            `
                SELECT
                    id,
                    option_text
                FROM poll_options
                WHERE poll_id = ?
                ORDER BY id ASC
            `,
            [id]
        );

        const poll = {
            ...polls[0],
            options: options.map((option) => option.option_text),
        };

        res.json({
            poll,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Failed to get poll",
            error: err.message,
        });
    }
};


export const addPoll = async (req, res) => {
    const connection = await db.getConnection();

    try {
        const {
            question,
            options,
            start_date,
            end_date,
            status,
        } = req.body;

        const cleanQuestion = question?.trim();

        const cleanOptions = Array.isArray(options)
            ? options
                .map((option) => option.trim())
                .filter((option) => option !== "")
            : [];

        if (!cleanQuestion) {
            return res.status(400).json({
                message: "Question is required",
            });
        }

        if (cleanOptions.length < 2) {
            return res.status(400).json({
                message: "At least 2 options are required",
            });
        }

        await connection.beginTransaction();

        const [pollResult] = await connection.query(
            `
                INSERT INTO polls
                    (question, start_date, end_date, status)
                VALUES (?, ?, ?, ?)
            `,
            [
                cleanQuestion,
                start_date || null,
                end_date || null,
                status || "active",
            ]
        );

        const pollId = pollResult.insertId;

        const optionValues = cleanOptions.map((option) => [
            pollId,
            option,
        ]);

        await connection.query(
            `
                INSERT INTO poll_options
                    (poll_id, option_text)
                VALUES ?
            `,
            [optionValues]
        );

        await connection.commit();

        res.status(201).json({
            message: "Poll created successfully",
            pollId,
        });
    } catch (err) {
        await connection.rollback();

        console.error(err);

        res.status(500).json({
            message: "Failed to create poll",
            error: err.message,
        });
    } finally {
        connection.release();
    }
};


export const updatePoll = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            question,
            options,
            start_date,
            end_date,
            status,
        } = req.body;

        const cleanQuestion = question?.trim();

        const cleanOptions = Array.isArray(options)
            ? options
                .map(option => option.trim())
                .filter(option => option !== "")
            : [];

        if (!cleanQuestion) {
            return res.status(400).json({
                message: "Question is required",
            });
        }

        if (cleanOptions.length < 2) {
            return res.status(400).json({
                message: "At least 2 options are required",
            });
        }

        const [existingPoll] = await db.query(
            "SELECT id FROM polls WHERE id = ?",
            [id]
        );

        if (existingPoll.length === 0) {
            return res.status(404).json({
                message: "Poll not found",
            });
        }

        await db.query(
            `
                UPDATE polls
                SET
                    question = ?,
                    start_date = ?,
                    end_date = ?,
                    status = ?
                WHERE id = ?
            `,
            [
                cleanQuestion,
                start_date || null,
                end_date || null,
                status || "active",
                id,
            ]
        );


        await db.query(
            `
                DELETE pv
                FROM poll_votes pv
                INNER JOIN poll_options po
                    ON pv.option_id = po.id
                WHERE po.poll_id = ?
            `,
            [id]
        );

        await db.query(
            "DELETE FROM poll_options WHERE poll_id = ?",
            [id]
        );

        const optionValues = cleanOptions.map(option => [
            id,
            option,
        ]);

        await db.query(
            `
                INSERT INTO poll_options
                    (poll_id, option_text)
                VALUES ?
            `,
            [optionValues]
        );

        res.json({
            message: "Poll updated successfully",
            pollId: Number(id),
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Failed to update poll",
            error: err.message,
        });
    }
};

export const deletePoll = async (req, res) => {
    try {
        const { id } = req.params;

        const [polls] = await db.query(
            "SELECT id FROM polls WHERE id = ?",
            [id]
        );

        if (polls.length === 0) {
            return res.status(404).json({
                message: "Poll not found",
            });
        }

        await db.query(
            `
                DELETE pv
                FROM poll_votes pv
                INNER JOIN poll_options po
                    ON pv.option_id = po.id
                WHERE po.poll_id = ?
            `,
            [id]
        );

        await db.query(
            "DELETE FROM poll_options WHERE poll_id = ?",
            [id]
        );

        await db.query(
            "DELETE FROM polls WHERE id = ?",
            [id]
        );

        res.json({
            message: "Poll deleted successfully",
            pollId: Number(id),
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Failed to delete poll",
            error: err.message,
        });
    }
};

export const getPollResults = async (req, res) => {
    try {
        const { id } = req.params;

        const [polls] = await db.query(
            `
                SELECT
                    id,
                    question,
                    status,
                    start_date,
                    end_date
                FROM polls
                WHERE id = ?
            `,
            [id]
        );

        if (polls.length === 0) {
            return res.status(404).json({
                message: "Poll not found",
            });
        }

        const [options] = await db.query(
            `
                SELECT
                    po.id,
                    po.option_text,
                    COUNT(pv.id) AS votes
                FROM poll_options po
                LEFT JOIN poll_votes pv
                    ON po.id = pv.option_id
                WHERE po.poll_id = ?
                GROUP BY
                    po.id,
                    po.option_text
                ORDER BY po.id ASC
            `,
            [id]
        );

        const totalVotes = options.reduce(
            (total, option) => total + Number(option.votes),
            0
        );

        const results = options.map((option) => ({
            ...option,
            votes: Number(option.votes),
            percentage:
                totalVotes > 0
                    ? Math.round(
                        (Number(option.votes) / totalVotes) * 100
                    )
                    : 0,
        }));

        res.json({
            poll: polls[0],
            totalVotes,
            results,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Failed to get poll results",
            error: err.message,
        });
    }
};
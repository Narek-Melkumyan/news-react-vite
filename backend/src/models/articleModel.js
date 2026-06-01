import db from "../../config/db.js";

export const getAllPosts = async ({ search, status, category }) => {
    let sql = `
        SELECT
            posts.*,
            categories.name AS category_name,
            authors.name AS author_name,
            authors.avatar AS author_avatar
        FROM posts
        JOIN categories
            ON posts.category_id = categories.id
        JOIN authors
            ON posts.author_id = authors.id
        WHERE 1 = 1
    `;

    const values = [];

    if (search) {
        sql += `
            AND (
                posts.title LIKE ?
                OR posts.short_description LIKE ?
                OR posts.content LIKE ?
                OR categories.name LIKE ?
                OR authors.name LIKE ?
            )
        `;

        values.push(
            `%${search}%`,
            `%${search}%`,
            `%${search}%`,
            `%${search}%`,
            `%${search}%`
        );
    }

    if (status) {
        sql += ` AND posts.status = ?`;
        values.push(status);
    }

    if (category) {
        sql += ` AND posts.category_id = ?`;
        values.push(category);
    }

    sql += ` ORDER BY posts.id DESC`;

    const [posts] = await db.query(sql, values);

    return posts;
};

export const getPostById = async (id) => {
    const [rows] = await db.query(
        `
            SELECT
                p.*,
                c.name AS category_name,
                au.name AS author_name
            FROM posts p
            LEFT JOIN categories c
                ON p.category_id = c.id
            LEFT JOIN authors au
                ON p.author_id = au.id
            WHERE p.id = ?
        `,
        [id]
    );

    return rows[0];
};

export const deletePostById = async (id) => {
    const [result] = await db.query(
        "DELETE FROM posts WHERE id = ?",
        [id]
    );

    return result;
};

export const getAllAuthors = async () => {
    const [authors] = await db.query(
        "SELECT id, name FROM authors"
    );

    return authors;
};

export const getSlugs = async () => {
    const [rows] = await db.query(
        "SELECT slug FROM posts"
    );

    return rows.map((row) => row.slug);
};

export const createPost = async ({category, author, title, slug, shortDesc,
 body, thumbnailUrl, video_url, status, featured, breaking,}) => {
    const [result] = await db.query(
        `
            INSERT INTO posts
            (
                category_id,
                author_id,
                title,
                slug,
                short_description,
                content,
                image,
                video_url,
                views,
                status,
                is_featured,
                is_breaking
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            category,
            author,
            title,
            slug,
            shortDesc,
            body,
            thumbnailUrl,
            video_url || null,
            0,
            status || "draft",
            featured ? 1 : 0,
            breaking ? 1 : 0,
        ]
    );

    return result;
};

export const getPostOnlyById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM posts WHERE id = ?",
        [id]
    );

    return rows[0];
};

export const updatePostById = async (id, {category, author, title, slug, shortDesc, body, imageUrl,
    video_url, status, featured, breaking, publishDate,}) => {
    const [result] = await db.query(
        `
            UPDATE posts
            SET
                category_id = ?,
                author_id = ?,
                title = ?,
                slug = ?,
                short_description = ?,
                content = ?,
                image = ?,
                video_url = ?,
                status = ?,
                is_featured = ?,
                is_breaking = ?,
                published_at = ?
            WHERE id = ?
        `,
        [
            category,
            author,
            title,
            slug,
            shortDesc,
            body,
            imageUrl,
            video_url || null,
            status,
            featured === "1" ? 1 : 0,
            breaking === "1" ? 1 : 0,
            publishDate || null,
            id,
        ]
    );

    return result;
};

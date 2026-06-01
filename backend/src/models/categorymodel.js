import db from "../../config/db.js";

export const addNewCategory = async ({name, slug, description, status}) => {
    const [result] = await db.query(
        `
            INSERT INTO categories
            (name, slug, description, status)
            VALUES (?, ?, ?, ?)
            `,
        [
            name,
            slug,
            description,
            status
        ]
    );
   return result.insertId
}

export const categoryAll = async () => {
    const [all] = await db.query(
        `SELECT * FROM categories `
    );
    return all;
}
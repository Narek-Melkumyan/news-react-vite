import db from "../../config/db.js";
import {addNewCategory, categoryAll} from "../models/categorymodel.js";

export const addCategory = async (req, res) => {
    try {

        const {
            name,
            slug,
            description,
            status
        } = req.body;

        if (!name || !slug) {
            return res.status(400).json({
                success: false,
                message: "Name and slug are required"
            });
        }

        const insertId= await addNewCategory({
            name,
            slug,
            description,
            status
        })
        res.status(201).json({
            success: true,
            message: "Category added successfully",
            categoryId: insertId
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};

export const getAllCategories = async (req, res) => {
    try {

        const categories = await categoryAll()

        res.json(categories);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};

export const deleteCategory = async (req, res) => {

    try {

        const { id } = req.params;

        await db.query(
            `DELETE FROM categories WHERE id = ?`,
            [id]
        );

        res.json({
            success: true,
            message: "Category deleted"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false
        });

    }
};

export const updateCategory = async (req, res) => {
    try {

        const { id } = req.params;
        const { category } = req.body;



        await db.query(
            `
            UPDATE categories
            SET
                name = ?,
                slug = ?,
                description = ?,
                status = ?
            WHERE id = ?
            `,
            [category.name, category.slug, category.description, category.status, id]
        );

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server error",
        });

    }
};

import {
    createPost, deletePostById, getAllAuthors, getAllPosts, getPostById, getPostOnlyById, getSlugs, updatePostById
} from "../models/articleModel.js";
import {aiOutput} from "../services/openAiService.js";
import {fileUpload} from "../services/UploaderService.js";

export const getPosts = async (req, res) => {
    try {
        const {search, status, category} = req.query;

        const posts = await getAllPosts({
            search, status, category,
        });

        res.status(200).json({
            success: true, posts,
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false, message: "Server error", error: err.message,
        });
    }
};

export const getArticleById = async (req, res) => {
    try {
        const {id} = req.params;

        const article = await getPostById(id);

        if (!article) {
            return res.status(404).json({
                message: "Article not found",
            });
        }

        res.json({
            article,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error", error: error.message,
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Post id is required",
            });
        }

        const result = await deletePostById(id);


        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        res.json({
            message: "Post deleted successfully", postId: id,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Something went wrong", error: error.message,
        });
    }
};

export const getAuthors = async (req, res) => {
    try {
        const authors = await getAllAuthors();

        res.json({
            success: true, authors,
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false, message: "Server error", error: err.message,
        });
    }
};

export const getAllSlugs = async (req, res) => {
    try {
        const slugs = await getSlugs();

        res.json({
            success: true, slugs,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false, message: "Server error", error: error.message,
        });
    }
};

export const addPost = async (req, res) => {
    try {
        const {
            title, slug, shortDesc, body, status, category, author, featured, breaking, video_url,
        } = req.body;

        const file = req.file;

        let thumbnailUrl = await fileUpload(file);

        const result = await createPost({
            category, author, title, slug, shortDesc, body, thumbnailUrl, video_url, status, featured, breaking,
        });

        res.json({
            message: "Post created successfully", post: {
                id: result.insertId,
                title,
                slug,
                shortDesc,
                body,
                status: status || "draft",
                category_id: Number(category),
                author_id: Number(author),
                image: thumbnailUrl,
                video_url: video_url || null,
                is_featured: featured ? 1 : 0,
                is_breaking: breaking ? 1 : 0,
            },
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Something went wrong", error: error.message,
        });
    }
};

export const editArticle = async (req, res) => {
    try {
        const {id} = req.params;

        const {
            title, slug, shortDesc, body, status, publishDate, category, author, featured, breaking, video_url,
        } = req.body;

        const oldArticle = await getPostOnlyById(id);

        if (!oldArticle) {
            return res.status(404).json({
                message: "Article not found",
            });
        }

        let imageUrl = await fileUpload(req.file, oldArticle.image);


        await updatePostById(id, {
            category,
            author,
            title,
            slug,
            shortDesc,
            body,
            imageUrl,
            video_url,
            status,
            featured,
            breaking,
            publishDate,
        });

        res.json({
            message: "Article updated successfully", articleId: id, image: imageUrl,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error", error: error.message,
        });
    }
};

export const generateArticleWithAI = async (req, res) => {
    try {
        const {title, shortDesc} = req.body;

        if (!title || !shortDesc) {
            return res.status(400).json({
                message: "Title and short description are required"
            });
        }

        const response = await aiOutput(`
You are a news article writer.

Based on this title and short description, generate:
1. article content
2. image alt text
3. image caption
4. SEO title
5. SEO description
6. SEO keywords

Return ONLY valid JSON. No markdown.

Title: ${title}
Short description: ${shortDesc}

JSON format:
{
  "content": "full article content here",
  "altText": "image alt text here",
  "caption": "image caption here",
  "seo_title": "seo title here",
  "seo_description": "seo description here",
  "seo_keywords": "seo keywords here",
}
            `)

        const text = response.output_text;

        const aiData = JSON.parse(text);

        res.json({
            message: "AI generated successfully", data: aiData
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "AI generation failed", error: error.message
        });
    }
};



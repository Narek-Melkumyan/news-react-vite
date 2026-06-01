import db from "../../config/db.js";


export const mainIndex=async (req, res) => {
    try {
        const categoriesPromise = db.query(`
            SELECT
                id,
                name,
                slug
            FROM categories
            WHERE status = 1
            ORDER BY name ASC
        `);

        const headerPostsPromise = db.query(`
            SELECT
                id,
                title,
                slug,
                short_description,
                image,
                created_at
            FROM posts
            WHERE status = 'published'
              AND is_featured = 1
            ORDER BY created_at DESC
                LIMIT 3
        `);

        const [categoriesResult, postsResult] = await Promise.all([
            categoriesPromise,
            headerPostsPromise,
        ]);

        const [categories] = categoriesResult;
        const [headerPosts] = postsResult;

        res.json({
            categories,
            headerPosts,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error",
        });
    }
}

export const homePage = async (req, res) => {

        try {
            const mostViewedPromise = db.query(`
      SELECT 
        id,
        category_id,
        author_id,
        title,
        slug,
        short_description,
        image,
        views,
        created_at
      FROM posts
      WHERE status = 'published'
      ORDER BY views DESC
      LIMIT 1
    `);

            const otherPostsPromise = db.query(`
      SELECT 
        id,
        category_id,
        author_id,
        title,
        slug,
        short_description,
        image,
        views,
        created_at
      FROM posts
      WHERE status = 'published'
      ORDER BY created_at DESC
      LIMIT 2
    `);

            const [mostViewedResult, otherPostsResult] = await Promise.all([
                mostViewedPromise,
                otherPostsPromise,
            ]);

            const [mostViewedRows] = mostViewedResult;
            const [otherPosts] = otherPostsResult;

            const mostViewedPost = mostViewedRows[0];

            res.json({
                mostViewedPost,
                otherPosts,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Server error",
            });
        }

}

export const mostRead = async (req, res) => {
        try {
            const mostViewedPostsPromise = db.query(`
                SELECT
                    id,
                    title,
                    slug,
                    short_description,
                    image,
                    views,
                    created_at,
                    content
                FROM posts
                WHERE status = 'published'
                ORDER BY views DESC
                    LIMIT 3
            `);

            const feedPostsPromise = db.query(`
      SELECT 
        id,
        title,
        slug,
        short_description,
        image,
        views,
        created_at
      FROM posts
      WHERE status = 'published'
      ORDER BY created_at DESC
      LIMIT 4
    `);

            const [mostViewedResults, feedPostsResult] = await Promise.all([
                mostViewedPostsPromise,
                feedPostsPromise,
            ]);

            const [mostViewed] = mostViewedResults;
            const [feedPosts] = feedPostsResult;

            res.json({
                mostViewed,
                feedPosts,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Server error" });
        }

}

export const regionsAndInterviews = async (req, res) => {
    try {
        const [regionsResult, interviewsResult] = await Promise.all([
            db.query(`
                SELECT 
                    p.id,
                    p.title,
                    p.slug,
                    p.short_description,
                    p.image,
                    p.views,
                    p.created_at,
                    p.content
                FROM posts p
                JOIN categories c ON p.category_id = c.id
                WHERE c.slug = ?
                  AND p.status = 'published'
                ORDER BY p.created_at DESC
                LIMIT 2
            `, ["regions"]),

            db.query(`
                SELECT 
                    p.id,
                    p.title,
                    p.slug,
                    p.short_description,
                    p.image,
                    p.views,
                    p.created_at,
                    p.content
                FROM posts p
                JOIN categories c ON p.category_id = c.id
                WHERE c.slug = ?
                  AND p.status = 'published'
                ORDER BY p.created_at DESC
                LIMIT 4
            `, ["interviews"])
        ]);

        const [regionsPosts] = regionsResult;
        const [interviewsPosts] = interviewsResult;

        res.json({
            regions: regionsPosts,
            interviews: interviewsPosts
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export const getDailyQuotes = async (req, res) => {
    try {
        const [quotes] = await db.query(`
            SELECT 
                id,
                quote,
                author_name,
                author_position,
                author_image,
                created_at
            FROM daily_quotes
            WHERE status = 'active'
            ORDER BY id DESC
            LIMIT 3
        `);

        res.json(quotes);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export const getVideos = async (req, res) => {
    try {
        const [videos] = await db.query(`
            SELECT
                id,
                title,
                image,
                video_url,
                created_at
            FROM posts
            WHERE status = 'published'
              AND video_url IS NOT NULL
              AND video_url != ''
            ORDER BY id DESC
                LIMIT 3
        `);

        res.json(videos);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
export const getInternational = async (req, res) => {
    try{
        const [inter] = await db.query(`
    SELECT 
        p.id,
        p.title,
        p.slug,
        p.short_description,
        p.image,
        p.views,
        p.created_at,
        p.content
    FROM posts p
    JOIN categories c ON p.category_id = c.id
    WHERE c.slug = ?
      AND p.status = 'published'
    ORDER BY p.created_at DESC
    LIMIT 4
`, ["world"]);

        res.json(inter);

    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });    }


}

export const pool=async (req, res) => {
    try {
        const [poll] = await db.query(
            "SELECT * FROM polls WHERE status='active' LIMIT 1"
        );

        const [options] = await db.query(
            "SELECT * FROM poll_options WHERE poll_id = ?",
            [poll[0].id]
        );

        res.json({
            poll: poll[0],
            options
        });

    } catch (err) {
        console.log(err);
    }
}

export const votes=async (req, res) => {
    try {
        const { option_id } = req.body;

        await db.query(
            "UPDATE poll_options SET votes = votes + 1 WHERE id = ?",
            [option_id]
        );

        res.json({ success: true });

    } catch (err) {
        console.log(err);
    }
}


export const getArticleBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const [articleResult, feedPostsResult] = await Promise.all([
            db.query(
                `SELECT * 
                 FROM posts 
                 WHERE slug = ? AND status = 'published'`,
                [slug]
            ),

            db.query(
                `SELECT 
                    id,
                    title,
                    slug,
                    short_description,
                    image,
                    views,
                    created_at
                 FROM posts
                 WHERE status = 'published'
                   AND slug != ?
                 ORDER BY created_at DESC
                 LIMIT 4`,
                [slug]
            )
        ]);

        const [articles] = articleResult;
        const [feedPosts] = feedPostsResult;

        if (articles.length === 0) {
            return res.status(404).json({
                message: "Article not found"
            });
        }

        res.json({
            article: articles[0],
            feedPosts
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

export const getVideoById = async (req, res) => {
    try{
        const { id } = req.params;

        const [videosResult, feedPostsResult] = await Promise.all([
            db.query(`SELECT * FROM posts WHERE id = ?`,[id]),
            db.query(
                `SELECT 
                    id,
                    title,
                    slug,
                    short_description,
                    image,
                    views,
                    created_at
                 FROM posts
                 WHERE status = 'published'
                   AND id != ?
                 ORDER BY created_at DESC
                 LIMIT 4`,
                [id]
            )
        ])

        const [video] = videosResult
        const [feedPosts] = feedPostsResult;

        if(video.length === 0){
            return res.status(404).json({
                message: "Video not found"
            })
        }

        res.json({
            video: video[0],
            feedPosts
        });


    }catch(error){
        console.log(error);
    }
}


export const getAllArticlesByCategoryId = async (req, res) => {
    try {
        const { id } = req.params;

        const [articlesResult, feedPostsResult, categoryResult] = await Promise.all([
            db.query(
                `SELECT
                     posts.*,
                     categories.name AS category_name,
                     categories.slug AS category_slug
                 FROM posts
                          JOIN categories ON posts.category_id = categories.id
                 WHERE posts.category_id = ?
                   AND posts.status = 'published'
                 ORDER BY posts.created_at DESC`,
                [id]
            ),

            db.query(
                `SELECT
                     id,
                     title,
                     slug,
                     short_description,
                     image,
                     views,
                     created_at
                 FROM posts
                 WHERE status = 'published'
                 ORDER BY created_at DESC
                     LIMIT 4`
            ),

            db.query(
                `SELECT 
                    id,
                    name,
                    slug,
                    description
                 FROM categories
                 WHERE id = ?`,
                [id]
            )
        ]);

        const [articles] = articlesResult;
        const [feedPosts] = feedPostsResult;
        const [category] = categoryResult;

        if (category.length === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.json({
            category: category[0],
            articles,
            feedPosts
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


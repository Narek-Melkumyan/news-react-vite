import {useEffect, useState} from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

function EditArticle() {
    const getAccessToken = () =>
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");

    const API_URL = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const navigate = useNavigate();

    const [body, setBody] = useState("");
    const [shortDesc, setShortDesc] = useState("");
    const [altText, setAltText] = useState("");
    const [caption, setCaption] = useState("");
    const [aiLoading, setAiLoading] = useState(false);

    const [seoTitle, setSeoTitle] = useState("");
    const [seoDescription, setSeoDescription] = useState("");
    const [seoKey, setSeoKey] = useState("");

    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");

    const [status, setStatus] = useState("draft");
    const [publishDate, setPublishDate] = useState("");
    const [category, setCategory] = useState("");
    const [author, setAuthor] = useState("");
    const [featured, setFeatured] = useState(false);
    const [breaking, setBreaking] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");

    const [oldThumbnail, setOldThumbnail] = useState("");

    const makeSlug = (text) =>
        text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

    useEffect(() => {
        async function fetchData() {
            try {
                const accessToken = getAccessToken();

                const requestOptions = {
                    credentials: "include",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                };

                const [categoriesRes, authorsRes] = await Promise.all([
                    fetch(`${API_URL}/categories`, requestOptions),
                    fetch(`${API_URL}/articles/getAuthors`, requestOptions),
                ]);

                const [categoriesData, authorsData] = await Promise.all([
                    categoriesRes.json(),
                    authorsRes.json(),
                ]);

                if (!categoriesRes.ok) {
                    throw new Error(
                        categoriesData.message || "Failed to load categories"
                    );
                }

                if (!authorsRes.ok) {
                    throw new Error(
                        authorsData.message || "Failed to load authors"
                    );
                }

                setCategories(categoriesData || []);
                setAuthors(authorsData.authors || []);
            } catch (err) {
                console.error(err);
            }
        }

        fetchData();
    }, []);
    const formatDateForInput = (dateValue) => {
        if (!dateValue) return "";
        return String(dateValue).slice(0, 10);
    };

    useEffect(() => {
        async function getArticle() {
            try {
                const accessToken = getAccessToken();

                const response = await fetch(
                    `${API_URL}/articles/${id}`,
                    {
                        credentials: "include",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load article"
                    );
                }

                const article = data.article || data;

                setTitle(article.title || "");
                setSlug(article.slug || "");
                setShortDesc(article.short_description || "");
                setBody(article.content || "");
                setStatus(article.status || "draft");
                setPublishDate(
                    formatDateForInput(article.published_at)
                );
                setCategory(article.category_id || "");
                setAuthor(article.author_id || "");
                setFeatured(Boolean(article.is_featured));
                setBreaking(Boolean(article.is_breaking));
                setOldThumbnail(article.image || "");
                setVideoUrl(article.video_url || "");

                setAltText(article.alt_text || "");
                setCaption(article.caption || "");
                setSeoTitle(article.seo_title || "");
                setSeoDescription(article.seo_description || "");
                setSeoKey(article.seo_keywords || "");
            } catch (err) {
                console.error(err);
            }
        }

        if (id) {
            getArticle();
        }
    }, [API_URL, id]);
    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        formData.set("body", body);
        formData.set("title", title);
        formData.set("slug", slug);
        formData.set("shortDesc", shortDesc);
        formData.set("status", status);
        formData.set("publishDate", publishDate);
        formData.set("category", category);
        formData.set("author", author);
        formData.set("featured", featured ? "1" : "0");
        formData.set("breaking", breaking ? "1" : "0");
        formData.set("altText", altText);
        formData.set("caption", caption);
        formData.set("video_url", videoUrl);
        formData.set("seoTitle", seoTitle);
        formData.set("seoDescription", seoDescription);
        formData.set("seoKey", seoKey);

        try {
            const accessToken = getAccessToken();

            const response = await fetch(
                `${API_URL}/articles/${id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message || "Update failed"
                );
            }

            navigate("/admin/articles");
        } catch (error) {
            console.error(error);
        }
    }
    async function handleGenerateAI() {
        if (!title || !shortDesc) {
            console.log("Please write title and short description first");
            return;
        }

        try {
            setAiLoading(true);

            const response = await fetch(`${API_URL}/articles/generateByIA`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    shortDesc,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "AI error");
            }

            setBody(result.data.content || "");
            setAltText(result.data.altText || "");
            setCaption(result.data.caption || "");
            setSeoTitle(result.data.seo_title || "");
            setSeoDescription(result.data.seo_description || "");
            setSeoKey(result.data.seo_keywords || "");
        } catch (error) {
            console.log(error, "AI generation failed");
        } finally {
            setAiLoading(false);
        }
    }

    return (
        <form
            className="page"
            id="articleEditorForm"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
        >
            <div className="page-header">
                <div>
                    <div className="breadcrumb-bar">
                        <Link to="/dashboard">
                            <i className="bi bi-house-door"></i>
                        </Link>

                        <span>·</span>

                        <Link to="/articles">
                            Articles
                        </Link>

                        <span>·</span>

                        <span>Edit</span>
                    </div>

                    <h1 className="page-title">
                        Edit article
                    </h1>

                    <div className="page-subtitle">
                        Update, format and prepare your story for publication.
                    </div>
                </div>

                <div className="d-flex gap-2 flex-wrap">
                    <Link
                        to="/admin/articles"
                        className="btn btn-light btn-icon"
                    >
                        <i className="bi bi-x-lg"></i>
                        Cancel
                    </Link>


                    <button
                        type="submit"
                        className="btn btn-primary btn-icon"
                    >
                        <i className="bi bi-check2-circle"></i>
                        Update
                    </button>
                </div>
            </div>

            <div className="row g-3">
                <div className="col-12 col-lg-8">
                    <div className="card">
                        <div className="card-body">
                            <input
                                className="form-control border-0 px-0 mb-2"
                                placeholder="Article title..."
                                required
                                type="text"
                                name="title"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    setSlug(makeSlug(e.target.value));
                                }}
                                style={{
                                    fontSize: "26px",
                                    fontWeight: 700,
                                    background: "transparent",
                                }}
                            />

                            <div
                                className="d-flex align-items-center gap-2 text-muted-2"
                                style={{
                                    fontSize: "13px",
                                }}
                            >
                                <i className="bi bi-link-45deg"></i>

                                <span>/article/</span>

                                <input
                                    className="form-control form-control-sm border-0 px-1"
                                    placeholder="auto-generated-from-title"
                                    type="text"
                                    name="slug"
                                    value={slug}
                                    onChange={(e) => setSlug(makeSlug(e.target.value))}
                                    style={{
                                        background: "transparent",
                                        fontFamily: "monospace",
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h5>Short description</h5>
                        </div>

                        <div className="card-body">
                            <textarea
                                className="form-control"
                                name="shortDesc"
                                rows="2"
                                placeholder="A 1-2 sentence summary that appears in feeds and previews."
                                value={shortDesc}
                                onChange={(e) => setShortDesc(e.target.value)}
                            ></textarea>

                            <button
                                type="button"
                                className="btn btn-soft-primary btn-icon mt-3"
                                onClick={handleGenerateAI}
                                disabled={aiLoading}
                            >
                                <i className="bi bi-magic"></i>
                                {aiLoading ? "Generating..." : "Generate with AI"}
                            </button>

                            <div className="form-text">
                                Recommended 140-180 characters. Used in social shares.
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5>Article content</h5>
                        </div>

                        <div className="card-body">
                            <ReactQuill
                                theme="snow"
                                value={body}
                                onChange={setBody}
                                placeholder="Start writing your article here..."
                                modules={{
                                    toolbar: [
                                        ["bold", "italic", "underline"],
                                        [{ header: 2 }],
                                        ["link", "image"],
                                        [{ list: "ordered" }, { list: "bullet" }],
                                        ["blockquote", "code-block"],
                                    ],
                                }}
                            />

                            <div className="form-text d-flex justify-content-between mt-2">
                                <span>
                                    <i className="bi bi-check2-circle me-1 text-success"></i>
                                    Ready to update
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h5>SEO</h5>
                            <span className="meta">Search engine preview</span>
                        </div>

                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="artSeoTitle">
                                    SEO title
                                </label>

                                <input
                                    type="text"
                                    value={seoTitle}
                                    onChange={(e) => setSeoTitle(e.target.value)}
                                    id="artSeoTitle"
                                    className="form-control"
                                    placeholder="Custom title for search engines"
                                />

                                <div className="form-text">
                                    <span id="seoTitleCount">{seoTitle.length}</span> / 60 characters
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label" htmlFor="artSeoDesc">
                                    SEO description
                                </label>

                                <textarea
                                    id="artSeoDesc"
                                    value={seoDescription}
                                    onChange={(e) => setSeoDescription(e.target.value)}
                                    className="form-control"
                                    rows="3"
                                    placeholder="Recommended 150-160 characters."
                                ></textarea>

                                <div className="form-text">
                                    <span id="seoDescCount">{seoDescription.length}</span> / 160 characters
                                </div>
                            </div>

                            <div className="mb-1">
                                <label className="form-label" htmlFor="artSeoKeywords">
                                    SEO keywords
                                </label>

                                <input
                                    type="text"
                                    id="artSeoKeywords"
                                    value={seoKey}
                                    onChange={(e) => setSeoKey(e.target.value)}
                                    className="form-control"
                                    placeholder="comma, separated, keywords"
                                />

                                <div className="form-text">
                                    Optional. Many search engines no longer use this.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-4">
                    <div className="card">
                        <div className="card-header">
                            <h5>
                                <i className="bi bi-send me-1"></i>
                                Publishing
                            </h5>
                        </div>

                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">
                                    Status
                                </label>

                                <select
                                    className="form-select"
                                    name="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="scheduled">Scheduled</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Publish date
                                </label>

                                <input
                                    className="form-control"
                                    type="date"
                                    name="publishDate"
                                    value={publishDate || ""}
                                    onChange={(e) => setPublishDate(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Category
                                </label>

                                <select
                                    className="form-select"
                                    name="category"
                                    required
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">Choose a Category</option>

                                    {categories.map((category) => (
                                        <option value={category.id} key={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Author
                                </label>

                                <select
                                    className="form-select"
                                    name="author"
                                    required
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                >
                                    <option value="">Choose author</option>

                                    {authors.map((author) => (
                                        <option value={author.id} key={author.id}>
                                            {author.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <hr
                                style={{
                                    borderColor: "var(--border)",
                                }}
                            />

                            <div className="form-check form-switch mb-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="featured"
                                    checked={featured}
                                    onChange={(e) => setFeatured(e.target.checked)}
                                />

                                <label className="form-check-label">
                                    <i className="bi bi-star-fill text-warning me-1"></i>
                                    <strong>Featured</strong>
                                </label>
                            </div>

                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="breaking"
                                    checked={breaking}
                                    onChange={(e) => setBreaking(e.target.checked)}
                                />

                                <label className="form-check-label">
                                    <i className="bi bi-lightning-charge-fill text-danger me-1"></i>
                                    <strong>Breaking news</strong>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h5>
                                <i className="bi bi-image me-1"></i>
                                Cover image
                            </h5>

                            {oldThumbnail && (
                                <div className="mb-3">
                                    <img
                                        src={oldThumbnail}
                                        alt={altText || "Article thumbnail"}
                                        style={{
                                            width: "100%",
                                            borderRadius: "12px",
                                            objectFit: "cover",
                                            maxHeight: "220px",
                                        }}
                                    />
                                </div>
                            )}

                            <input
                                type="file"
                                name="thumbnail"
                                className="form-control"
                            />

                            <div className="form-text">
                                Leave empty if you do not want to change the image.
                            </div>
                        </div>

                        <div className="card-body">
                            <div className="mt-3">
                                <label className="form-label">
                                    Alt text
                                </label>

                                <input
                                    className="form-control"
                                    placeholder="Describe the image"
                                    type="text"
                                    name="altText"
                                    value={altText}
                                    onChange={(e) => setAltText(e.target.value)}
                                />
                            </div>

                            <div className="mt-2">
                                <label className="form-label">
                                    Caption
                                </label>

                                <input
                                    className="form-control"
                                    placeholder="Photo by ..."
                                    type="text"
                                    name="caption"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                />
                            </div>

                            <div className="mt-3">
                                <label className="form-label">
                                    Video URL
                                </label>

                                <input
                                    className="form-control"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    type="url"
                                    name="video_url"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                />

                                <div className="form-text">
                                    Optional. Add YouTube or video link for this article.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default EditArticle;

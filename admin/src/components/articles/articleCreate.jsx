import {useEffect, useState} from 'react';
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {useNavigate} from "react-router-dom";




function ArticleCreate() {
    const API_URL = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();
    const [body, setBody] = useState("");
    const [shortDesc, setShortDesc] = useState("");
    const [altText, setAltText] = useState("");
    const [caption, setCaption] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [seoTitle, setSeoTitle] = useState("");
    const [seoDescription, setSeoDescription] = useState("");
    const [seoKey, setSeoKey] = useState("");
    const [allSlugs, setAllSlugs] = useState([]);
    const [slugError, setSlugError] = useState("");


    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");

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
                const [categoriesRes, authorsRes, slugsRes] = await Promise.all([
                    fetch(`${API_URL}/categories`),
                    fetch(`${API_URL}/articles/getAuthors`),
                    fetch(`${API_URL}/articles/getSlugs`),
                ]);

                const [categoriesData, authorsData, slugsData] = await Promise.all([
                    categoriesRes.json(),
                    authorsRes.json(),
                    slugsRes.json(),
                ]);

                setCategories(categoriesData || []);
                setAuthors(authorsData.authors || []);
                setAllSlugs(slugsData.slugs || []);

            } catch (err) {
                console.log(err);
            }
        }

        fetchData();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        if (allSlugs.includes(slug)) {
            setSlugError("This slug already exists");
            return;
        }

        const formData = new FormData(e.target);

        formData.set("body", body);

        try {
            const response = await fetch(`${API_URL}/articles`, {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                throw new Error(data.message || "Post create failed");
            }

            navigate("/articles");

        } catch (e) {
            console.log(e);
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
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    shortDesc
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "AI error");
            }

            setBody(result.data.content || "");
            setAltText(result.data.altText || "");
            setCaption(result.data.caption || "");
            setSeoTitle(result.data.seo_title || "");
            setSeoDescription(result.data.seo_description || '')
            setSeoKey(result.data.seo_keywords || '')


        } catch (error) {
            console.log(error,"AI generation failed");
        } finally {
            setAiLoading(false);
        }
    }

    const handleSlugChange = (value) => {
        const newSlug = makeSlug(value);

        setSlug(newSlug);

        if (allSlugs.includes(newSlug)) {
            setSlugError("This slug already exists");
        } else {
            setSlugError("");
        }
    };

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
                        <a href="dashboard.html">
                            <i className="bi bi-house-door"></i>
                        </a>

                        <span>·</span>

                        <a href="articles.html">
                            Articles
                        </a>

                        <span>·</span>

                        <span>Create new</span>
                    </div>

                    <h1 className="page-title">
                        Create new article
                    </h1>

                    <div className="page-subtitle">
                        Write, format and prepare your story for publication.
                    </div>
                </div>

                <div className="d-flex gap-2 flex-wrap">

                    <a
                        href="articles"
                        className="btn btn-light btn-icon"
                    >
                        <i className="bi bi-x-lg"></i>
                        Cancel
                    </a>

                    <button
                        type="button"
                        className="btn btn-soft-primary btn-icon"
                        disabled={!!slugError}
                    >
                        <i className="bi bi-cloud-arrow-up"></i>
                        Save draft
                    </button>

                    <button
                        type="submit"
                        className="btn btn-primary btn-icon"
                        disabled={!!slugError}
                    >
                        <i className="bi bi-check2-circle"></i>
                        Publish
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
                                    handleSlugChange(e.target.value);
                                }}
                                style={{
                                    fontSize: "26px",
                                    fontWeight: 700,
                                    background: "transparent"
                                }}
                            />

                            <div
                                className="d-flex align-items-center gap-2 text-muted-2"
                                style={{
                                    fontSize: "13px"
                                }}
                            >

                                <i className="bi bi-link-45deg"></i>

                                <span>/article/</span>

                                <input
                                    className={`form-control form-control-sm border-0 px-1 ${slugError ? "is-invalid" : ""}`}
                                    placeholder="auto-generated-from-title"
                                    type="text"
                                    name="slug"
                                    value={slug}
                                    onChange={(e) => handleSlugChange(e.target.value)}
                                    style={{
                                        background: "transparent",
                                        fontFamily: "monospace"
                                    }}
                                />

                                {slugError && (
                                    <div className="text-danger small mt-1">
                                        {slugError}
                                    </div>
                                )}

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
                                    Auto-saved a few seconds ago
                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="card">
                        <div className="card-header"><h5>SEO</h5><span className="meta">Search engine preview</span>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="artSeoTitle">SEO title</label>
                                <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} id="artSeoTitle" className="form-control"
                                       placeholder="Custom title for search engines"/>
                                <div className="form-text"><span id="seoTitleCount">{seoTitle.length}</span> / 60 characters</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="artSeoDesc">SEO description</label>
                                <textarea id="artSeoDesc" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className="form-control" rows="3"
                                          placeholder="Recommended 150-160 characters."></textarea>
                                <div className="form-text"><span id="seoDescCount">{seoDescription.length}</span> / 160 characters</div>
                            </div>
                            <div className="mb-1">
                                <label className="form-label" htmlFor="artSeoKeywords">SEO keywords</label>
                                <input type="text" id="artSeoKeywords" value={seoKey} onChange={(e) => setSeoKey(e.target.value)} className="form-control"
                                       placeholder="comma, separated, keywords"/>
                                <div className="form-text">Optional. Many search engines no longer use this.</div>
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
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Category
                                </label>

                                <select className="form-select" name="category" required>
                                    <option value="">Choose a Category</option>
                                    {categories.map(category => (
                                        <option value={category.id} key={category.id}>{category.name}</option>
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
                                >
                                    <option value="">Choose author</option>

                                    {authors.map((author) => (
                                        <option value={author.id} key={author.id}>{author.name}</option>
                                    ))}

                                </select>

                            </div>

                            <hr
                                style={{
                                    borderColor: "var(--border)"
                                }}
                            />

                            <div className="form-check form-switch mb-2">

                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="featured"
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

                            <input
                                type="file"
                                name="thumbnail"
                                className="form-control"
                            />

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

export default ArticleCreate;




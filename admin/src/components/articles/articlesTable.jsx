import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {apiFetch} from "../../utils/apiFetch.js";

function ArticlesTable() {
    const [articles, setArticles] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await apiFetch("/admin/categories", {
                    method: "GET",
                });

                const data = await res.json().catch(() => ({}));

                if (!res.ok) {
                    throw new Error(
                        data.message || "Failed to fetch categories"
                    );
                }

                setCategories(Array.isArray(data) ? data : data.categories || []);
            } catch (err) {
                console.error("Categories error:", err);
                setCategories([]);
            }
        }

        fetchCategories();
    }, []);

    useEffect(() => {
        async function fetchArticles() {
            try {
                const params = new URLSearchParams();

                if (search) {
                    params.append("search", search);
                }

                if (statusFilter) {
                    params.append("status", statusFilter);
                }

                if (categoryFilter) {
                    params.append("category", categoryFilter);
                }

                const query = params.toString();

                const res = await apiFetch(
                    `/admin/articles${query ? `?${query}` : ""}`,
                    {
                        method: "GET",
                    }
                );

                const data = await res.json().catch(() => ({}));

                if (!res.ok) {
                    throw new Error(
                        data.message || "Failed to fetch articles"
                    );
                }

                setArticles(data.posts || data.articles || []);
            } catch (err) {
                console.error("Articles error:", err);
                setArticles([]);
            }
        }

        fetchArticles();
    }, [search, statusFilter, categoryFilter]);

    async function deleteArticle(id) {
        try {
            const confirmed = window.confirm(
                "Are you sure you want to delete this article?"
            );

            if (!confirmed) {
                return;
            }

            const res = await apiFetch(`/admin/articles/${id}`, {
                method: "DELETE",
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to delete article"
                );
            }

            setArticles((previousArticles) =>
                previousArticles.filter((article) => article.id !== id)
            );
        } catch (error) {
            console.error("Delete article error:", error);
        }
    }

    return (
        <div className="card">
            <div className="table-toolbar">
                <div className="search">
                    <i className="bi bi-search"></i>

                    <input
                        className="form-control"
                        placeholder="Search by title, author..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All statuses</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                </select>

                <select
                    className="form-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">All categories</option>

                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <div
                    className="ms-auto text-muted-2"
                    style={{ fontSize: "13px" }}
                >
                    Sort: <strong className="text-dark">Newest first</strong>
                </div>
            </div>

            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Cover</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Views</th>
                        <th>Date</th>
                        <th style={{ width: "140px" }}>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {articles.map((article) => (
                        <tr key={article.id}>
                            <td>
                                <img
                                    className="cell-thumb"
                                    src={article.image}
                                    alt={article.title}
                                />
                            </td>

                            <td>
                                    <span className="cell-title">
                                        {article.title}
                                    </span>

                                <span className="cell-sub">
                                        {Number(article.is_featured) === 1 && (
                                            <i className="bi bi-star-fill text-warning me-1"></i>
                                        )}

                                    {Number(article.is_breaking) === 1 && (
                                        <span
                                            className="pill danger me-1"
                                            style={{
                                                padding: "1px 6px",
                                                fontSize: "10px",
                                            }}
                                        >
                                                Breaking
                                            </span>
                                    )}

                                    ID #{article.id}
                                    </span>
                            </td>

                            <td>
                                    <span className="pill brand">
                                        {article.category_name}
                                    </span>
                            </td>

                            <td>
                                <div className="cell-user">
                                    <span>{article.author_name}</span>
                                </div>
                            </td>

                            <td>
                                    <span
                                        className={`pill ${
                                            article.status === "published"
                                                ? "success"
                                                : article.status === "draft"
                                                    ? "warning"
                                                    : "info"
                                        }`}
                                    >
                                        {article.status}
                                    </span>
                            </td>

                            <td>{article.views}</td>

                            <td>
                                    <span className="text-muted-2">
                                        {new Date(article.created_at).toLocaleDateString(
                                            "en-US",
                                            {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            }
                                        )}
                                    </span>
                            </td>

                            <td>
                                <div className="row-actions">
                                    <Link
                                        to={`/admin/editArticle/${article.id}`}
                                        className="btn-act"
                                        title="Edit"
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Link>

                                    <button
                                        className="btn-act danger"
                                        title="Delete"
                                        onClick={() => deleteArticle(article.id)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="table-foot">
                <span>
                    Showing <strong>{articles.length ? 1 : 0}</strong>-
                    <strong>{articles.length}</strong> of{" "}
                    <strong>{articles.length}</strong> articles
                </span>

                <ul className="pagination mb-0">
                    <li className="page-item disabled">
                        <button className="page-link">
                            <i className="bi bi-chevron-left"></i>
                        </button>
                    </li>

                    <li className="page-item active">
                        <button className="page-link">1</button>
                    </li>

                    <li className="page-item">
                        <button className="page-link">2</button>
                    </li>

                    <li className="page-item">
                        <button className="page-link">
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default ArticlesTable;
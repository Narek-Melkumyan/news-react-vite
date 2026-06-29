import {
    NavLink,
    useNavigate,
    useOutletContext,
} from "react-router-dom";

import {useContext, useEffect, useState} from "react";
import {apiFetch} from "../utils/apiFetch.js";
import {AuthContext} from "../context/authContextValue.jsx";

function SideBar() {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const { admin } = useOutletContext();
    const [articlesCount, setArticlesCount] = useState(0);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchArticles() {
            try {
                const response = await apiFetch("/admin/articles",{
                    method: "GET",
                })

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch articles");
                }

                const posts = Array.isArray(data)
                    ? data
                    : data.posts || data.articles || [];

                if (!cancelled) {
                    setArticlesCount(posts.length);
                }
            } catch (error) {
                console.error("Articles error:", error);

                if (!cancelled) {
                    setArticlesCount(0);
                }
            }
        }
        fetchArticles();

        return () => {
            cancelled = true;
        };
    }, [API_URL]);

    async function handleLogout() {
        setLoggingOut(true);

        try {
            await logout();

            navigate("/login", {
                replace: true,
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setLoggingOut(false);
        }
    }

    const fullName = admin?.name || "Admin User";
    const role = admin?.role || "Administrator";

    const initials = fullName
        .split(" ")
        .filter(Boolean)
        .map((word) => word.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <>
            <aside className="sidebar">
                <div className="sidebar-header">
                    <span className="sidebar-logo">
                        <i className="bi bi-newspaper" />
                    </span>

                    <div>
                        <div className="sidebar-brand">
                            NewsDesk
                        </div>

                        <small>Admin Console v2.6</small>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-section">
                        Main
                    </div>

                    <NavLink
                        to="/admin/dashboard"
                        className="sidebar-link"
                    >
                        <i className="bi bi-grid-1x2" />
                        <span>Dashboard</span>
                    </NavLink>

                    <div className="sidebar-section">
                        Content
                    </div>

                    <NavLink
                        to="/admin/articles"
                        className="sidebar-link"
                    >
                        <i className="bi bi-file-text" />

                        <span>Articles</span>

                        <span className="badge bg-light text-dark">
                            {articlesCount}
                        </span>
                    </NavLink>

                    <NavLink
                        to="/admin/categories"
                        className="sidebar-link"
                    >
                        <i className="bi bi-tags" />
                        <span>Categories</span>
                    </NavLink>

                    <NavLink
                        to="/admin/polls"
                        className="sidebar-link"
                    >
                        <i className="bi bi-bar-chart" />
                        <span>Polls</span>
                    </NavLink>

                    {admin?.role === "admin" && (
                        <>
                            <div className="sidebar-section">
                                Audience
                            </div>

                            <NavLink
                                to="/admin/users"
                                className="sidebar-link"
                            >
                                <i className="bi bi-people"></i>
                                <span>Users &amp; Authors</span>
                            </NavLink>
                        </>
                    )}

                    <div className="sidebar-section">
                        System
                    </div>

                    <button
                        type="button"
                        className="sidebar-link"
                        onClick={handleLogout}
                        disabled={loggingOut}
                    >
                        <i className="bi bi-box-arrow-right" />

                        <span>
                            {loggingOut
                                ? "Signing out..."
                                : "Sign out"}
                        </span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="avatar">
                        {initials}
                    </div>

                    <div className="info">
                        <strong>{fullName}</strong>
                        <small>{role}</small>
                    </div>

                    <button
                        type="button"
                        className="icon-btn"
                        title="Toggle theme"
                    >
                        <i className="bi bi-moon-stars" />
                    </button>
                </div>
            </aside>

            <div className="sidebar-backdrop" />
        </>
    );
}

export default SideBar;


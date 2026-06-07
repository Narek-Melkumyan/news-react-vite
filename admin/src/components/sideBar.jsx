import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function SideBar() {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [articlesCount, setArticlesCount] = useState(0);
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const articlesRes = await fetch(`${API_URL}/articles`, {
                    credentials: "include",
                });

                if (!articlesRes.ok) {
                    throw new Error("Failed to fetch articles");
                }

                const data = await articlesRes.json();

                const posts = Array.isArray(data)
                    ? data
                    : data.posts || data.articles || [];

                setArticlesCount(posts.length);
            } catch (err) {
                console.log(err);
                setArticlesCount(0);
            }
        }

        fetchData();
    }, [API_URL]);

    useEffect(() => {
        async function getMe() {
            try {
                const res = await fetch(`http://localhost:3010/auth/me`, {
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error("Failed to get user");
                }

                const data = await res.json();

                setUser(data.user || data);
            } catch (err) {
                console.log(err);
                setUser(null);
            }
        }

        getMe();
    }, [API_URL]);

    async function handleLogout() {
        try {
            await fetch(`http://localhost:3010/auth/logout`, {
                method: "POST",
                credentials: "include",
            });

            navigate("/login");
        } catch (err) {
            console.log(err);
        }
    }

    const fullName = user?.name || "Admin User";
    const role = user?.role || "Administrator";

    const initials = fullName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <>
            <aside className="sidebar">
                <div className="sidebar-header">
                    <span className="sidebar-logo">
                        <i className="bi bi-newspaper"></i>
                    </span>

                    <div>
                        <div className="sidebar-brand">NewsDesk</div>
                        <small>Admin Console v2.6</small>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-section">Main</div>

                    <NavLink to="/admin/dashboard" className="sidebar-link">
                        <i className="bi bi-grid-1x2"></i>
                        <span>Dashboard</span>
                    </NavLink>

                    <div className="sidebar-section">Content</div>

                    <NavLink to="/admin/articles" className="sidebar-link">
                        <i className="bi bi-file-text"></i>
                        <span>Articles</span>
                        <span className="badge bg-light text-dark">
                            {articlesCount}
                        </span>
                    </NavLink>

                    <NavLink to="/admin/categories" className="sidebar-link">
                        <i className="bi bi-tags"></i>
                        <span>Categories</span>
                    </NavLink>

                    <NavLink to="/admin/polls" className="sidebar-link">
                        <i className="bi bi-bar-chart"></i>
                        <span>Polls</span>
                    </NavLink>


                    <div className="sidebar-section">Audience</div>

                    <NavLink to="/admin/users" className="sidebar-link">
                        <i className="bi bi-people"></i>
                        <span>Users &amp; Authors</span>
                    </NavLink>

                    <div className="sidebar-section">System</div>

                    <a href="settings.html" className="sidebar-link">
                        <i className="bi bi-gear"></i>
                        <span>Settings</span>
                    </a>

                    <button
                        type="button"
                        className="sidebar-link"
                        onClick={handleLogout}
                    >
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Sign out</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="avatar">{initials}</div>

                    <div className="info">
                        <strong>{fullName}</strong>
                        <small>{role}</small>
                    </div>

                    <button
                        className="icon-btn"
                        data-toggle-theme=""
                        title="Toggle theme"
                    >
                        <i className="bi bi-moon-stars"></i>
                    </button>
                </div>
            </aside>

            <div className="sidebar-backdrop"></div>
        </>
    );
}

export default SideBar;
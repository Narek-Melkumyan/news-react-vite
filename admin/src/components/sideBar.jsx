import {NavLink} from "react-router-dom";
import {useEffect, useState} from "react";

function SideBar() {

    const [articles, setArticles] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;


    useEffect(() => {
        async function fetchData() {
            try {

                const articlesRes = await fetch(
                    `${API_URL}/articles`,
                );

                const data = await articlesRes.json();

                setArticles(data.posts.length);

            } catch (err) {
                console.log(err);
            }
        }

        fetchData();
    }, []);



    return (
        <>
            <aside className="sidebar">
                <div className="sidebar-header">
                    <span className="sidebar-logo"><i className="bi bi-newspaper"></i></span>
                    <div>
                        <div className="sidebar-brand">NewsDesk</div>
                        <small>Admin Console v2.6</small>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-section">Main</div>
                    <NavLink to={"/dashboard"} href="dashboard.html" className="sidebar-link "><i
                        className="bi bi-grid-1x2"></i><span>Dashboard</span></NavLink>

                    <div className="sidebar-section">Content</div>
                    <NavLink to={"/articles"} href="articles.html" className="sidebar-link"><i
                        className="bi bi-file-text"></i><span>Articles</span><span
                        className="badge bg-light text-dark">{articles}</span></NavLink>
                    <NavLink to={"/categories"} href="categories.html" className="sidebar-link"><i
                        className="bi bi-tags"></i><span>Categories</span></NavLink>
                    <NavLink to={"/polls"} href="polls.html" className="sidebar-link"><i className="bi bi-bar-chart"></i><span>Polls</span></NavLink>
                    <a href="comments.html" className="sidebar-link"><i
                        className="bi bi-chat-left-text"></i><span>Comments</span><span
                        className="badge bg-warning text-dark">3</span></a>

                    <div className="sidebar-section">Audience</div>
                    <NavLink to={"/users"} href="users.html" className="sidebar-link"><i
                        className="bi bi-people"></i><span>Users &amp; Authors</span></NavLink>

                    <div className="sidebar-section">System</div>
                    <a href="settings.html" className="sidebar-link"><i className="bi bi-gear"></i><span>Settings</span></a>
                    <a href="index.html" className="sidebar-link"><i className="bi bi-box-arrow-right"></i><span>Sign out</span></a>
                </nav>

                <div className="sidebar-footer">
                    <div className="avatar">SJ</div>
                    <div className="info">
                        <strong>Sarah Johnson</strong>
                        <small>Administrator</small>
                    </div>
                    <button className="icon-btn" data-toggle-theme="" title="Toggle theme"><i
                        className="bi bi-moon-stars"></i></button>
                </div>
            </aside>
            <div className="sidebar-backdrop"></div>
        </>
    );
}

export default SideBar;
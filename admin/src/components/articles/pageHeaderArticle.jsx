import {Link} from "react-router-dom";

function PageHeaderArticle() {
    return (
        <div className="page-header">
            <div>
                <div className="breadcrumb-bar">
                    <a href="dashboard.html">
                        <i className="bi bi-house-door"></i>
                    </a>

                    <span>·</span>

                    <a href="#">Content</a>

                    <span>·</span>

                    <span>Articles</span>
                </div>

                <h1 className="page-title">Articles</h1>

                <div className="page-subtitle">
                    Write, schedule and publish your stories.
                </div>
            </div>

            <div className="d-flex gap-2">
                <button className="btn btn-light btn-icon">
                    <i className="bi bi-funnel"></i> Filters
                </button>

                <button className="btn btn-light btn-icon">
                    <i className="bi bi-download"></i> Export
                </button>

                <Link to={'/createArticle'}
                    className="btn btn-primary btn-icon"
                >
                    <i className="bi bi-plus-lg"></i> New Article
                </Link>
            </div>
        </div>
    );
}

export default PageHeaderArticle;
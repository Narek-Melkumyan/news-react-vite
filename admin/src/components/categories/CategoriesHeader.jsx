
function CategoriesHeader({setModal}) {
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

                    <span>Categories</span>
                </div>

                <h1 className="page-title">Categories</h1>

                <div className="page-subtitle">
                    Organize your articles into clean, navigable sections.
                </div>
            </div>

            <div className="d-flex gap-2">
                <button className="btn btn-light btn-icon">
                    <i className="bi bi-download"></i> Export
                </button>

                <button className="btn btn-primary btn-icon" id="catNameNew"
                onClick={() => {setModal(true)}}
                >
                    <i className="bi bi-plus-lg"></i> Add Category
                </button>
            </div>
        </div>
    );
}

export default CategoriesHeader;
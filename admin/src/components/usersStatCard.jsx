
function UsersStatCard({data}) {

    const total = data.length;
    const admin = data.filter((user) => user.role === "admin").length;
    const editor = data.filter((user) => user.role === "editor").length;
    const author = data.filter((user) => user.role === "author").length;
    return (
        <div className="row g-3 mb-3">
            <div className="col-6 col-md-3">
                <div className="stat-card">
                    <div className="stat-card-top">
                        <div className="stat-icon brand"><i className="bi bi-people"></i></div>
                    </div>
                    <div>
                        <div className="stat-value">{total}</div>
                        <div className="stat-label">Total team</div>
                    </div>
                </div>
            </div>
            <div className="col-6 col-md-3">
                <div className="stat-card">
                    <div className="stat-card-top">
                        <div className="stat-icon danger"><i className="bi bi-shield-lock"></i></div>
                    </div>
                    <div>
                        <div className="stat-value">{admin}</div>
                        <div className="stat-label">Administrators</div>
                    </div>
                </div>
            </div>
            <div className="col-6 col-md-3">
                <div className="stat-card">
                    <div className="stat-card-top">
                        <div className="stat-icon purple"><i className="bi bi-pencil-square"></i></div>
                    </div>
                    <div>
                        <div className="stat-value">{editor}</div>
                        <div className="stat-label">Editors</div>
                    </div>
                </div>
            </div>
            <div className="col-6 col-md-3">
                <div className="stat-card">
                    <div className="stat-card-top">
                        <div className="stat-icon info"><i className="bi bi-feather"></i></div>
                    </div>
                    <div>
                        <div className="stat-value">{author}</div>
                        <div className="stat-label">Authors</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UsersStatCard;
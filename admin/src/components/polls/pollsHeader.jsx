
function PollsHeader({open}) {



    return (
        <div className="page-header">
            <div>
                <div className="breadcrumb-bar">
                    <a href="dashboard.html"><i className="bi bi-house-door"></i></a>
                    <span>·</span><a href="#">Content</a><span>·</span><span>Polls</span>
                </div>
                <h1 className="page-title">Polls &amp; Voting</h1>
                <div className="page-subtitle">Engage readers with live polls and surveys.</div>
            </div>
            <button className="btn btn-primary btn-icon" onClick={open} id="pollNewBtn"><i className="bi bi-plus-lg"></i> New Poll
            </button>
        </div>

    );
}

export default PollsHeader;
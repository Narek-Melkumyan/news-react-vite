function PollsStats({ polls = [] }) {
    const totalPolls = polls?.length;

    const activePolls = polls?.filter(p => p.status === "active").length;

    const totalVotes = polls?.reduce((sum, poll) => {
        return sum + Number(poll.total_votes || 0);
    }, 0);

    return (
        <div className="row g-3 mb-3">
            <div className="col-6 col-md-3">
                <div className="stat-card">
                    <div className="stat-card-top">
                        <div className="stat-icon brand">
                            <i className="bi bi-bar-chart"></i>
                        </div>
                    </div>
                    <div>
                        <div className="stat-value">{totalPolls}</div>
                        <div className="stat-label">Total polls</div>
                    </div>
                </div>
            </div>

            <div className="col-6 col-md-3">
                <div className="stat-card">
                    <div className="stat-card-top">
                        <div className="stat-icon success">
                            <i className="bi bi-broadcast"></i>
                        </div>
                    </div>
                    <div>
                        <div className="stat-value">{activePolls}</div>
                        <div className="stat-label">Active polls</div>
                    </div>
                </div>
            </div>

            <div className="col-6 col-md-3">
                <div className="stat-card">
                    <div className="stat-card-top">
                        <div className="stat-icon purple">
                            <i className="bi bi-hand-thumbs-up"></i>
                        </div>
                    </div>
                    <div>
                        <div className="stat-value">{totalVotes}</div>
                        <div className="stat-label">Total votes</div>
                    </div>
                </div>
            </div>

            <div className="col-6 col-md-3">
                <div className="stat-card">
                    <div className="stat-card-top">
                        <div className="stat-icon info">
                            <i className="bi bi-people"></i>
                        </div>
                    </div>
                    <div>
                        <div className="stat-value">68%</div>
                        <div className="stat-label">Engagement rate</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PollsStats;
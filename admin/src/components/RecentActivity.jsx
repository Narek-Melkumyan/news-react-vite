// components/RecentActivity.jsx

import React from "react";

function RecentActivity({ data = [] }) {
    return (
        <div className="chart-card">
            <div className="chart-card-head">
                <div>
                    <h5>Recent activity</h5>
                    <div className="meta">Latest editorial actions</div>
                </div>

                <a
                    href="#"
                    className="text-muted-2"
                    style={{ fontSize: "12px" }}
                >
                    View all
                </a>
            </div>

            <ul className="activity-list">
                {data.map((item, index) => (
                    <li className="activity-item" key={index}>
                        <div className={`activity-icon stat-icon ${item.color}`}>
                            <i className={`bi ${item.icon}`}></i>
                        </div>

                        <div className="activity-body">
                            {item.text}

                            <div className="activity-time">
                                {item.time}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RecentActivity;
// components/ViewsChart.jsx

import React from "react";

function ViewsChart({ data = [] }) {
    const maxViews = Math.max(...data.map(item => item.views));

    const totalViews = data.reduce((acc, item) => acc + item.views, 0);

    return (
        <div className="chart-card">
            <div className="chart-card-head">
                <div>
                    <h5>Page views by day</h5>
                    <div className="meta">Last 7 days · all categories</div>
                </div>

                <select
                    className="form-select form-select-sm"
                    style={{ width: "auto" }}
                >
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                </select>
            </div>

            <div className="bar-chart">
                {data.map((item, index) => (
                    <div className="bar-col" key={index}>
                        <div
                            className="bar"
                            style={{
                                height: `${(item.views / maxViews) * 100}%`,
                            }}
                            title={`${item.views.toLocaleString()} views`}
                        ></div>

                        <div className="bar-label">{item.day}</div>
                    </div>
                ))}
            </div>

            <div
                className="d-flex justify-content-between text-muted-2 mt-3"
                style={{ fontSize: "12px" }}
            >
        <span>
          <i className="bi bi-circle-fill text-primary me-1"></i>
          Page views
        </span>

                <span>
          Total this week:{" "}
                    <strong className="text-dark">
            {totalViews.toLocaleString()}
          </strong>
        </span>
            </div>
        </div>
    );
}

export default ViewsChart;
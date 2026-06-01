
function StatCard({
                      icon,
                      iconColor,
                      trend,
                      trendType = "up",
                      value,
                      label,
                      footer,
                  }) {
    return (
        <div className="stat-card">
            <div className="stat-card-top">
                <div className={`stat-icon ${iconColor}`}>
                    <i className={`bi ${icon}`}></i>
                </div>

                <span className={`stat-trend ${trendType}`}>
          <i
              className={`bi ${
                  trendType === "up"
                      ? "bi-arrow-up-short"
                      : "bi-arrow-down-short"
              }`}
          ></i>

                    {trend}
        </span>
            </div>

            <div>
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
            </div>

            <div className="stat-foot">{footer}</div>
        </div>
    );
}

export default StatCard;
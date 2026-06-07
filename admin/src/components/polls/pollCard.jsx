function PollCard({ poll, onEdit, onDelete, onResults }) {
    return (
        <tr data-id={poll.id}>
            <td>
                <span className="cell-title">
                    {poll.question}
                </span>

                <span className="cell-sub">
                    {poll.options_count} options · Single choice
                </span>
            </td>

            <td>
                <strong>{poll.total_votes || 0}</strong>{" "}
                <span className="text-muted-2">votes</span>
            </td>

            <td>
                <span
                    className={`pill ${
                        poll.status === "active"
                            ? "success"
                            : "muted"
                    }`}
                >
                    {poll.status}
                </span>
            </td>

            <td>
                <span className="text-muted-2">
                    {poll.start_date?.split("T")[0] || "-"}
                </span>
            </td>

            <td>
                <span className="text-muted-2">
                    {poll.end_date?.split("T")[0] || "-"}
                </span>
            </td>

            <td>
                <div className="row-actions">
                    <button
                        type="button"
                        className="btn-act"
                        title="Results"
                        onClick={onResults}
                    >
                        <i className="bi bi-bar-chart"></i>
                    </button>

                    <button
                        type="button"
                        className="btn-act"
                        title="Edit"
                        onClick={onEdit}
                    >
                        <i className="bi bi-pencil"></i>
                    </button>

                    <button
                        type="button"
                        className="btn-act danger"
                        title="Delete"
                        onClick={onDelete}
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default PollCard;
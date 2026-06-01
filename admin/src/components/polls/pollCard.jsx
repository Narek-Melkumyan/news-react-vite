
function PollCard({ poll }) {
    return (
        <tr data-id="1">
            <td>
                <span className="cell-title">{poll.question}</span>
                <span className="cell-sub">{poll.options_count} options · Single choice</span>
            </td>
            <td><strong>{poll.total_votes}</strong> <span className="text-muted-2">votes</span></td>
            <td><span className={`pill ${poll.status === "active"?"success":"muted"}`}>{poll.status}</span></td>
            <td><span className="text-muted-2">{poll.start_date?.split("T")[0]}</span></td>
            <td><span className="text-muted-2">{poll.end_date?.split("T")[0]}</span></td>
            <td>
                <div className="row-actions">
                    <button className="btn-act" data-results="1" title="Results"><i
                        className="bi bi-bar-chart"></i></button>
                    <button className="btn-act" data-edit="1" title="Edit"><i
                        className="bi bi-pencil"></i></button>
                    <button className="btn-act danger" data-del="1" title="Delete"><i
                        className="bi bi-trash"></i></button>
                </div>
            </td>
        </tr>

    );
}

export default PollCard;

function UserCard({user}) {
    return (
        <tr >
            <td>
                <div className="cell-user">
                    <div className="user-avatar lg bg-warning">SJ</div>
                    <div>
                        <span className="cell-title" style={{margin:"0"}}>{user.name}</span>
                        <span className="cell-sub">
                    Joined {new Date(user.created_at).toISOString().split("T")[0]}
                        </span>
                    </div>
                </div>
            </td>
            <td><span className="text-muted-2">{user.email}</span></td>
            <td><span className={`pill ${user.role === "admin" ? "danger" : user.role === "editor" ? "purple" : "brand"}`}>{user.role}</span></td>
            <td><span className={`pill ${user.status === "active" ? "success" : "muted"}`}>{user.status}</span></td>
            <td><strong>0</strong></td>
            <td>
                <div className="row-actions">
                    <button className="btn-act" data-edit="1" title="Edit"><i
                        className="bi bi-pencil"></i></button>
                    <button className="btn-act danger" data-del="1" title="Delete"><i
                        className="bi bi-trash"></i></button>
                </div>
            </td>
        </tr>

    );
}

export default UserCard;
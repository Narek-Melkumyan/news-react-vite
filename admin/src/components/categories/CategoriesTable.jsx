

function CategoriesTable({data,setEdit,onOpen}) {
    const accessToken =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
    const API_URL = import.meta.env.VITE_API_URL;

    async function deleteCategory(id) {

        try {

            const res = await fetch(
                `${API_URL}/categories/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                    headers: accessToken
                        ? {
                            Authorization: `Bearer ${accessToken}`,
                        }
                        : {},
                }
            );
            if (data.success) {

                setData(prev =>
                    prev.filter(item => item.id !== id)
                );

            }

            const data = await res.json();

            console.log(data);

        } catch (err) {

            console.log(err);

        }
    }

    function editCategory(val) {
        setEdit(val)
        onOpen(true);
    }


    return (
        <div className="card">

            <div className="table-toolbar">

                <div className="search">
                    <i className="bi bi-search"></i>

                    <input
                        type="text"
                        placeholder="Search categories..."
                    />
                </div>

                <select
                    className="form-select"
                    style={{ width: "auto" }}
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                <div
                    className="ms-auto text-muted-2"
                    style={{ fontSize: "13px" }}
                >
                    Sort:{" "}
                    <strong className="text-dark">
                        Newest first
                    </strong>
                </div>

            </div>

            <div className="table-responsive">

                <table className="data-table">

                    <thead>
                    <tr>
                        <th style={{ width: "80px" }}>ID</th>
                        <th>Category</th>
                        <th>Slug</th>
                        <th>Status</th>
                        <th>Articles</th>
                        <th style={{ width: "120px" }}>
                            Actions
                        </th>
                    </tr>
                    </thead>

                    <tbody>

                    {data?.map((item) => (
                        <tr key={item.id}>

                            <td>
                                    <span className="text-muted-2">
                                     #{item.id}
                     </span>
                            </td>

                            <td>
                  <span className="cell-title">
                    {item.name}
                  </span>

                                <span className="cell-sub">
                    {item.description}
                  </span>
                            </td>

                            <td>
                                <code className="text-muted-2">
                                    {item.slug}
                                </code>
                            </td>

                            <td>
                  <span
                      className={`pill ${
                          item.status === "active"
                              ? "success"
                              : "muted"
                      }`}
                  >
                    {item.status}
                  </span>
                            </td>

                            <td>
                                <strong>
                                    {item.articles}
                                </strong>{" "}

                                <span className="text-muted-2">
                    articles
                  </span>
                            </td>

                            <td>

                                <div className="row-actions">

                                    <button
                                        className="btn-act"
                                        title="Edit"
                                        onClick={() => {editCategory(item)}}
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </button>

                                    <button className="btn-act danger" title="Delete" onClick={() => deleteCategory(item.id)}>
                                        <i className="bi bi-trash"></i>
                                    </button>

                                </div>

                            </td>

                        </tr>
                    ))}

                    </tbody>

                </table>

            </div>

            <div className="table-foot">

        <span>
          Showing <strong>1-{data.length}</strong> of{" "}
            <strong>{data.length}</strong> categories
        </span>

                <ul className="pagination mb-0">

                    <li className="page-item disabled">
                        <a className="page-link" href="#">
                            <i className="bi bi-chevron-left"></i>
                        </a>
                    </li>

                    <li className="page-item active">
                        <a className="page-link" href="#">
                            1
                        </a>
                    </li>

                    <li className="page-item disabled">
                        <a className="page-link" href="#">
                            <i className="bi bi-chevron-right"></i>
                        </a>
                    </li>

                </ul>

            </div>

        </div>
    );
}

export default CategoriesTable;
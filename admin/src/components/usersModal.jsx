import {apiFetch} from "../utils/apiFetch.js";

function UsersModal({ close,refreshUsers }) {
    async function register(e) {
        e.preventDefault();

        try {
            const formData = new FormData(e.currentTarget);

            const name = formData.get("name")?.trim();
            const email = formData.get("email")?.trim();
            const password = formData.get("password");
            const role = formData.get("role");
            const status = formData.get("status");

            const res = await apiFetch("/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role,
                    status,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data.message || "Register failed");
            }

            await refreshUsers();
            close();
        } catch (err) {
            console.log(err.message);
        }
    }
    return (
        <div className="modal fade show" id="usrModal" tabIndex="-1" style={{ display: "block" }} aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <form className="modal-content" id="usrForm" onSubmit={register} noValidate>
                    <div className="modal-header">
                        <h5 className="modal-title" id="usrModalTitle">
                            Add New User
                        </h5>

                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={close}></button>
                    </div>

                    <div className="modal-body">
                        <input type="hidden" id="usrId" name="id" value="" readOnly />

                        <div className="text-center mb-4">
                            <div className="user-avatar lg bg-brand mx-auto mb-2" style={{width: "72px", height: "72px", fontSize: "24px",}}>
                                +
                            </div>

                            <button type="button" className="btn btn-light btn-sm">
                                Upload avatar
                            </button>
                        </div>

                        <div className="row g-3">
                            <div className="col-12">
                                <label className="form-label" htmlFor="usrName">
                                    Full Name <span className="text-danger">*</span>
                                </label>

                                <input type="text" id="usrName" name="name" className="form-control" placeholder="Jane Doe" required/>
                            </div>

                            <div className="col-12">
                                <label className="form-label" htmlFor="usrEmail">
                                    Email Address <span className="text-danger">*</span>
                                </label>

                                <input type="email" id="usrEmail" name="email" className="form-control" placeholder="jane@newsdesk.com" autoComplete="email" required/>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label" htmlFor="usrRole">
                                    Role
                                </label>

                                <select id="usrRole" name="role" className="form-select" defaultValue="author">
                                    <option value="admin">Admin</option>
                                    <option value="editor">Editor</option>
                                    <option value="author">Author</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label" htmlFor="usrStatus">
                                    Status
                                </label>

                                <select id="usrStatus" name="status" className="form-select" defaultValue="active">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="col-12">
                                <label className="form-label" htmlFor="usrPass">
                                    Password
                                </label>

                                <input type="password" id="usrPass" name="password" className="form-control" placeholder="Min 8 characters" autoComplete="new-password" required/>

                                <div className="form-text">
                                    Min 8 characters with letters and numbers.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-light" data-bs-dismiss="modal" onClick={close}>
                            Cancel
                        </button>

                        <button type="submit" className="btn btn-primary">
                            Save User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UsersModal;

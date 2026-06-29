import {useEffect, useState} from "react";
import UsersModal from "../components/usersModal.jsx";
import UserCard from "../components/userCard.jsx";
import UsersStatCard from "../components/usersStatCard.jsx";
import {apiFetch} from "../utils/apiFetch.js";

function Users() {
    const [modal, setModal] = useState(false);
    const [userData, setUserData] = useState([]);
    async function getUsers() {
        try {
            const res = await apiFetch(
                "/admin/users/getUsers",
                {
                    method: "GET",
                }
            );

            const data = await res.json();

            setUserData(data.users || []);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div className="page">

            <div className="page-header">
                <div>
                    <div className="breadcrumb-bar">
                        <a href="dashboard.html"><i className="bi bi-house-door"></i></a>
                        <span>·</span><a href="#">Audience</a><span>·</span><span>Users &amp; Authors</span>
                    </div>
                    <h1 className="page-title">Users &amp; Authors</h1>
                    <div className="page-subtitle">Manage your editorial team and their permissions.</div>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-light btn-icon"><i className="bi bi-envelope"></i> Invite by email
                    </button>
                    <button className="btn btn-primary btn-icon" id="usrNewBtn" onClick={() => setModal(true)}><i
                        className="bi bi-person-plus"></i> Add User
                    </button>
                </div>
            </div>

            <UsersStatCard data={userData} />

            <div className="card">
                <div className="table-toolbar">
                    <div className="search">
                        <i className="bi bi-search"></i>
                        <input type="text" id="usrSearch" placeholder="Search users..."/>
                    </div>
                    <select className="form-select" id="usrRoleFilter" style={{width:"auto"}}>
                        <option value="all">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="Author">Author</option>
                    </select>
                </div>
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Articles</th>
                            <th style={{width: "120px"}}>Actions</th>
                        </tr>
                        </thead>
                        <tbody id="usrTbody">
                        {userData?.map(user => {
                            return (<UserCard user={user} key={user.id} />)
                        })}
                        </tbody>
                    </table>
                </div>
                <div className="table-foot">
                    <span>Showing <strong>1-7</strong> of <strong>7</strong> users</span>
                    <ul className="pagination mb-0">
                        <li className="page-item active"><a className="page-link" href="#">1</a></li>
                    </ul>
                </div>
            </div>
            {modal&&<UsersModal close={() => setModal(false)} refreshUsers={getUsers}></UsersModal>}

        </div>

    );
}

export default Users;
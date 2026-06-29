import { useContext } from "react";
import { AuthContext } from "../context/authContextValue";

function Header() {
    const { user } = useContext(AuthContext);

    const fullName = user?.name || "Admin User";
    const role = user?.role || "Administrator";

    const initials = fullName.split(" ").filter(Boolean).map((word) => word[0]).join("").slice(0, 2).toUpperCase();

    return (
        <header className="topbar">
            <button className="menu-btn" data-toggle-sidebar="">
                <i className="bi bi-list"></i>
            </button>

            <div className="topbar-actions">
                <button className="icon-btn" title="Help">
                    <i className="bi bi-question-circle"></i>
                </button>

                <button
                    className="icon-btn"
                    data-toggle-theme=""
                    title="Toggle theme"
                >
                    <i className="bi bi-moon-stars"></i>
                </button>

                <button className="icon-btn" title="Notifications">
                    <i className="bi bi-bell"></i>
                    <span className="dot"></span>
                </button>

                <button className="icon-btn" title="Messages">
                    <i className="bi bi-envelope"></i>
                </button>

                <span className="divider-y"></span>

                <div className="topbar-profile">
                    <div className="avatar">{initials}</div>

                    <div>
                        <div className="name">{fullName}</div>
                        <div className="role">{role}</div>
                    </div>

                    <i className="bi bi-chevron-down text-muted-2"></i>
                </div>
            </div>
        </header>
    );
}

export default Header;
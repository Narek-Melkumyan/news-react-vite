import { useEffect, useState } from "react";

function Header() {
    const API_URL = import.meta.env.VITE_API_URL;

    const [user, setUser] = useState(null);

    useEffect(() => {
        async function getMe() {
            try {
                const res = await fetch(`http://localhost:3010/auth/me`, {
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error("Failed to get user");
                }

                const data = await res.json();

                setUser(data.user);
            } catch (err) {
                console.log(err);
                setUser(null);
            }
        }

        getMe();
    }, [API_URL]);

    const fullName = user?.name || "Admin User";
    const role = user?.role || "Administrator";

    const initials = fullName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <>
            <header className="topbar">
                <button className="menu-btn" data-toggle-sidebar="">
                    <i className="bi bi-list"></i>
                </button>



                <div className="topbar-actions">
                    <button className="icon-btn" title="Help">
                        <i className="bi bi-question-circle"></i>
                    </button>

                    <button className="icon-btn" data-toggle-theme="" title="Toggle theme">
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
        </>
    );
}

export default Header;
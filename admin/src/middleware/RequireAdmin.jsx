import { useContext } from "react";
import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

import { AuthContext } from "../context/authContextValue";

export default function RequireAdmin() {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    const allowedRoles = ["admin", "editor", "author"];

    if (loading) {
        return (
            <div style={styles.wrap}>
                Loading...
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname,
                }}
            />
        );
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    if (user.status && user.status !== "active") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet context={{ admin: user }} />;
}

const styles = {
    wrap: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        color: "#fff",
        fontSize: 14,
    },
};

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

function GuestRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (user) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
}

export default GuestRoute;
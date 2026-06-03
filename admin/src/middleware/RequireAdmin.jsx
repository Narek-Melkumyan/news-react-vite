import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";


export default function RequireAdmin() {
    const [status, setStatus] = useState("loading"); // "loading" | "ok" | "unauth"
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        let cancelled = false;

        fetch(`http://localhost:3010/auth/me`, { credentials: "include" })
            .then(async (res) => {
                if (!res.ok) throw new Error("Unauthorized");
                const data = await res.json();
                if (cancelled) return;
                setAdmin(data.user);
                setStatus("ok");
            })
            .catch(() => {
                if (cancelled) return;
                setStatus("unauth");
            });

        return () => {
            cancelled = true;
        };
    }, []);

    if (status === "loading") {
        return <div style={styles.wrap}>Loading...</div>;
    }

    if (status === "unauth") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet context={{ admin }} />;
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


import { useEffect, useState } from "react";
import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

const API_URL = "http://localhost:3010";

function getAccessToken() {
    return (
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken")
    );
}

function saveNewAccessToken(accessToken) {
    if (localStorage.getItem("accessToken")) {
        localStorage.setItem("accessToken", accessToken);
        return;
    }

    sessionStorage.setItem("accessToken", accessToken);
}

function clearAuthStorage() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
}

export default function RequireAdmin() {
    const [status, setStatus] = useState("loading");
    const [admin, setAdmin] = useState(null);
    const allowedRoles = ["admin", "editor", "author"];
    const location = useLocation();

    useEffect(() => {
        let cancelled = false;

        async function getCurrentUser(accessToken) {
            return fetch(`${API_URL}/auth/me`, {
                method: "GET",
                credentials: "include",
                headers: accessToken
                    ? {
                        Authorization: `Bearer ${accessToken}`,
                    }
                    : {},
            });
        }

        async function refreshAccessToken() {
            const response = await fetch(
                `${API_URL}/auth/refresh`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            const data = await response
                .json()
                .catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message || "Refresh failed"
                );
            }

            if (!data.accessToken) {
                throw new Error(
                    "New access token not received"
                );
            }

            saveNewAccessToken(data.accessToken);

            return data.accessToken;
        }

        async function checkAdmin() {
            try {
                let accessToken = getAccessToken();

                if (!accessToken) {
                    accessToken = await refreshAccessToken();
                }

                let response = await getCurrentUser(accessToken);


                if (response.status === 401) {
                    accessToken = await refreshAccessToken();
                    response = await getCurrentUser(accessToken);
                }

                const data = await response
                    .json()
                    .catch(() => ({}));

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unauthorized"
                    );
                }

                if (!allowedRoles.includes(data.role)) {
                    throw new Error("Panel access required");
                }

                if (data.status && data.status !== "active") {
                    throw new Error(
                        "Your account is not active"
                    );
                }

                if (cancelled) return;

                const storage = localStorage.getItem(
                    "accessToken"
                )
                    ? localStorage
                    : sessionStorage;

                storage.setItem(
                    "user",
                    JSON.stringify(data)
                );

                setAdmin(data);
                setStatus("ok");
            } catch (error) {
                if (cancelled) return;

                console.error("Admin auth error:", error);

                clearAuthStorage();
                setAdmin(null);
                setStatus("unauth");
            }
        }

        checkAdmin();

        return () => {
            cancelled = true;
        };
    }, []);

    if (status === "loading") {
        return (
            <div style={styles.wrap}>
                Loading...
            </div>
        );
    }

    if (status === "unauth") {
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
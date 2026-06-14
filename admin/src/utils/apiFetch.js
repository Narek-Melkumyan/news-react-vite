const API_URL = "http://localhost:3010";

function getAccessToken() {
    return (
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken")
    );
}

function saveAccessToken(token) {
    if (localStorage.getItem("accessToken")) {
        localStorage.setItem("accessToken", token);
    } else {
        sessionStorage.setItem("accessToken", token);
    }
}

function clearAuth() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
}

export async function apiFetch(path, options = {}) {
    async function sendRequest(token) {
        const headers = new Headers(options.headers || {});

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        if (
            options.body &&
            !(options.body instanceof FormData) &&
            !headers.has("Content-Type")
        ) {
            headers.set("Content-Type", "application/json");
        }

        return fetch(`${API_URL}${path}`, {
            ...options,
            credentials: "include",
            headers,
        });
    }

    let accessToken = getAccessToken();

    let response = await sendRequest(accessToken);

    if (response.status !== 401) {
        return response;
    }

    const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
    });

    const refreshData = await refreshResponse
        .json()
        .catch(() => ({}));

    if (!refreshResponse.ok || !refreshData.accessToken) {
        clearAuth();
        return response;
    }

    accessToken = refreshData.accessToken;

    saveAccessToken(accessToken);

    response = await sendRequest(accessToken);

    return response;
}
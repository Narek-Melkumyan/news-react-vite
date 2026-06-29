const BASE_URL = "http://localhost:3010";


// src/api/fetchClient.js

let accessToken = null;
let refreshPromise = null;

export const setAccessToken = (token) => {
    accessToken = token;
};


async function baseFetch(url, options = {}) {
    const isFormData = options.body instanceof FormData;

    return fetch(BASE_URL + url, {
        ...options,
        credentials: "include",
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...(options.headers || {}),
        },
    });
}

// refresh token request (ONLY ONCE AT A TIME)
async function refreshToken() {
    if (!refreshPromise) {
        refreshPromise = baseFetch("/auth/refresh", {
            method: "POST",
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Refresh failed");
                return res.json();
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

// main request handler with auto refresh
export async function fetchClient(url, options = {}, _retry = false) {
    const headers = {
        ...(options.headers || {}),
    };

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await baseFetch(url, {
        ...options,
        headers,
    });

    // If unauthorized → try refresh once
    if (response.status === 401 && !_retry) {
        try {
            const data = await refreshToken();

            if (data?.accessToken) {
                setAccessToken(data.accessToken);
            }

            // retry original request ONCE
            return fetchClient(url, options, true);
        } catch {
            return response;
        }
    }

    return response;
}

export const apiFetch = fetchClient;

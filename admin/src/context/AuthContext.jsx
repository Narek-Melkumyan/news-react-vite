import { useEffect, useState } from "react";

import { AuthContext } from "./authContextValue";
import {fetchClient, setAccessToken} from "../utils/apiFetch.js";

const BASE_URL = "http://localhost:3010";

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function login(data) {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
            return {
                ok: false,
                message: json.message || "Login failed",
            };
        }

        setUser(json.user);
        setAccessToken(json.accessToken);

        return {
            ok: true,
            message: json.message || "Logged in successfully",
            user: json.user,
        };
    }

    async function register(data) {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const json = await res.json().catch(() => ({}));

        return {
            ok: res.ok,
            message: json.message || (res.ok ? "Registered successfully" : "Register failed"),
            user: json.user,
        };
    }

    async function logout() {
        try {
            await fetchClient("/auth/logout", {
                method: "POST",
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            setAccessToken(null);
        }
    }

    async function initAuth() {
        try {
            const res = await fetchClient("/auth/me");

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                setUser(null);
                setAccessToken(null);
                return;
            }

            setUser(json);
        } catch (error) {
            console.error("Init auth error:", error);
            setUser(null);
            setAccessToken(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        initAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{user, loading, login, register, logout, setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

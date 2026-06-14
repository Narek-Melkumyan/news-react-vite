import { useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL = "http://localhost:3010";

function Login() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    async function login(e) {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);

            const email = formData.get("email")?.trim();
            const password = formData.get("password");
            const rememberMe = formData.get("rememberMe") === "on";

            if (!email || !password) {
                throw new Error("Email and password are required");
            }

            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            if (!data.accessToken) {
                throw new Error("Access token not received");
            }

            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("user");

            const storage = rememberMe
                ? localStorage
                : sessionStorage;

            storage.setItem("accessToken", data.accessToken);
            storage.setItem("user", JSON.stringify(data.user));

            navigate("/admin", {
                replace: true,
            });
        } catch (error) {
            setMessage(error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="login-form-side">
            <div className="login-card">
                <h3>Welcome back</h3>

                <p className="subtitle">
                    Sign in to your editorial dashboard.
                </p>

                <form onSubmit={login}>
                    <div className="mb-3">
                        <label
                            className="form-label"
                            htmlFor="loginEmail"
                        >
                            Email address
                        </label>

                        <input
                            type="email"
                            id="loginEmail"
                            name="email"
                            autoComplete="email"
                            className="form-control form-control-lg"
                            placeholder="you@newsdesk.com"
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label
                            className="form-label d-flex justify-content-between"
                            htmlFor="loginPassword"
                        >
                            Password

                            <a
                                href="#"
                                className="text-muted-2 fw-normal f-s12"
                                onClick={(e) => e.preventDefault()}
                            >
                                Forgot password?
                            </a>
                        </label>

                        <div className="input-group input-group-lg">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="loginPassword"
                                name="password"
                                autoComplete="current-password"
                                className="form-control"
                                placeholder="••••••••"
                                required
                            />

                            <button
                                className="btn btn-light"
                                type="button"
                                onClick={() =>
                                    setShowPassword((prev) => !prev)
                                }
                            >
                                <i
                                    className={
                                        showPassword
                                            ? "bi bi-eye-slash"
                                            : "bi bi-eye"
                                    }
                                />
                            </button>
                        </div>
                    </div>

                    <div className="form-check my-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="rememberMe"
                            name="rememberMe"
                            defaultChecked
                        />

                        <label
                            className="form-check-label text-muted-2"
                            htmlFor="rememberMe"
                        >
                            Keep me signed in
                        </label>
                    </div>

                    <button
                        className="btn btn-primary w-100 btn-lg btn-icon justify-content-center"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            "Signing in..."
                        ) : (
                            <>
                                <i className="bi bi-box-arrow-in-right" />
                                {" "}Sign in
                            </>
                        )}
                    </button>

                    {message && (
                        <p className="text-danger mt-3">
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </section>
    );
}

export default Login;
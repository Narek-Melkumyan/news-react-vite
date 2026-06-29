import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContextValue";

function Login() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);

            const email = formData.get("email")?.trim();
            const password = formData.get("password");

            if (!email || !password) {
                throw new Error("Email and password are required");
            }

            const result = await login({
                email,
                password,
            });

            if (!result.ok) {
                throw new Error(result.message || "Login failed");
            }

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

                <form onSubmit={handleLogin}>
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

                    <button
                        className="btn btn-primary w-100 btn-lg btn-icon justify-content-center mt-3"
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
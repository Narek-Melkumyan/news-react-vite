import {useNavigate} from "react-router-dom";
import {useState} from "react";

function Login() {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    async function login(e) {
        e.preventDefault();
        setMessage("");
        try {
            const form = e.target;

            const formData = new FormData(form);


            const email = formData.get("email");
            const password = formData.get("password");

            const res = await fetch("http://localhost:3010/auth/login", {
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


            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            console.log(data);

            navigate("/dashboard");
        } catch (err) {
            setMessage(err.message);
        }
    }



    return (
        <section className="login-form-side">
            <div className="login-card">
                <h3>Welcome back</h3>
                <p className="subtitle">Sign in to your editorial dashboard.</p>

                <form id="loginForm" onSubmit={login} noValidate>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="loginEmail">Email address</label>
                        <input type="email" id="loginEmail" name="email" autoComplete="email" className="form-control form-control-lg"
                               placeholder="you@newsdesk.com" required/>
                    </div>

                    <div className="mb-2">
                        <label className="form-label d-flex justify-content-between" htmlFor="loginPassword">
                            Password
                            <a href="#" className="text-muted-2 fw-normal f-s12">Forgot
                                password?</a>
                        </label>
                        <div className="input-group input-group-lg">
                            <input type="password" id="loginPassword" autoComplete="current-password" name="password" className="form-control"
                                   placeholder="••••••••"  required/>
                            <button className="btn btn-light" type="button" id="togglePass"><i
                                className="bi bi-eye"></i></button>
                        </div>
                    </div>

                    <div className="form-check my-3">
                        <input className="form-check-input" type="checkbox" id="rememberMe" defaultChecked/>
                        <label className="form-check-label text-muted-2" htmlFor="rememberMe">Keep me signed in for
                            30 days</label>
                    </div>

                    <button className="btn btn-primary w-100 btn-lg btn-icon justify-content-center" type="submit">
                        <i className="bi bi-box-arrow-in-right"></i> Sign in
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

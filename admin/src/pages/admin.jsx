import { Link, useNavigate, useOutletContext } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Admin() {
    const navigate = useNavigate();
    // Provided by RequireAdmin via <Outlet context={{ admin }} />
    const { admin } = useOutletContext();

    const logout = async () => {
        await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
        navigate("/login");
    };

    return (
        <div style={styles.wrap}>
            <div style={styles.card}>
                <h1 style={styles.title}>Admin Dashboard</h1>
                <div style={styles.row}><b>Name:</b> {admin.name}</div>
                <div style={styles.row}><b>Email:</b> {admin.email}</div>
                <div style={styles.nav}>
                    <Link to="/admin/products">Products</Link>
                    <Link to="/admin/users">Users</Link>
                </div>
                <button style={styles.button} onClick={logout}>Logout</button>
            </div>
        </div>
    );
}

const styles = {
    wrap: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        color: "#0f172a",
    },
    card: {
        width: 360,
        padding: 24,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 10px 30px rgba(0,0,0,.2)",
    },
    title: { margin: 0, marginBottom: 16, fontSize: 20 },
    row: { marginBottom: 8, fontSize: 14 },
    nav: { display: "flex", gap: 12, marginTop: 12, fontSize: 14 },
    button: {
        marginTop: 16,
        padding: "10px 12px",
        background: "#ef4444",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: 14,
        width: "100%",
    },
};


function LoginBrand() {
    return (
        <aside className="login-side">
            <div className="login-brand">
                <span className="login-brand-icon"><i className="bi bi-newspaper"></i></span>
                NewsDesk <span className="text-secondary fw-normal">Admin</span>
            </div>

            <div className="login-tagline">
                <h2>The newsroom command center your editors will love.</h2>
                <p>Manage articles, polls, comments and contributors from one elegant dashboard built for modern
                    publishers.</p>
            </div>

            <div className="login-stats">
                <div>
                    <div className="login-stat-num">12.4K</div>
                    <div className="login-stat-label">Articles published</div>
                </div>
                <div>
                    <div className="login-stat-num">2.1M</div>
                    <div className="login-stat-label">Monthly readers</div>
                </div>
                <div>
                    <div className="login-stat-num">98%</div>
                    <div className="login-stat-label">Editor satisfaction</div>
                </div>
            </div>
        </aside>
    );
}

export default LoginBrand;
export const verifyTurnstile = async (req, res, next) => {
    try {
        const token = req.headers["x-turnstile-token"];

        if (!token) {
            return res.status(400).json({
                message: "Captcha verification is required",
                articles: []
            });
        }

        const body = new URLSearchParams();

        body.append("secret", process.env.TURNSTILE_SECRET_KEY);
        body.append("response", token);
        body.append("remoteip", req.ip);

        const response = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                body
            }
        );

        const result = await response.json();

        if (!result.success) {
            return res.status(403).json({
                message: "Captcha verification failed",
                articles: []
            });
        }

        next();
    } catch (error) {
        console.error("Turnstile error:", error);

        return res.status(500).json({
            message: "Captcha verification error",
            articles: []
        });
    }
};
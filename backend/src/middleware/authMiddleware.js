import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (
            !authorization ||
            !authorization.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                message: "Access token is required",
            });
        }

        const token = authorization.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired access token",
        });
    }
};

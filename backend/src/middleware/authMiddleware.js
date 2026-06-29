import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {
        console.log(req.headers);
        const token =
            req.cookies?.accessToken ||
            req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Access token is required",
            });
        }

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
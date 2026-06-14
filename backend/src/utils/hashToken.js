import crypto from "crypto";

export const hashToken = async (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};
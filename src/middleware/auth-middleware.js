import jwt from "jsonwebtoken";
import "dotenv/config";

const secret_key = process.env.JWT_SECRET_KEY;

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    //const authHeader = req.headers.authorization || "";

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token no proporcionado o formato inválido" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, secret_key);
        req.user = decoded; // Ahora en req.user tenés { id, email }
        next();
    } catch (error) {
        return res.status(403).json({ error: "Token inválido o expirado" });
    }
};

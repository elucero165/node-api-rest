import jwt from "jsonwebtoken";
import "dotenv/config";

const secret_key = process.env.JWT_SECRET_KEY;

// Función para generar el token
export const generateToken = (userData) => {
    const payload = { id: userData.id, email: userData.email };
    const options = { expiresIn: "1h" };
    return jwt.sign(payload, secret_key, options);
};

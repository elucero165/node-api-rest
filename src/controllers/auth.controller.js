import { generateToken } from "../utils/token-generator.js";
import * as model from "../models/auth.model.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await model.getUsersEmail(email);

    if (!usuario) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    // Validar la contraseña
    const isPasswordValid = await bcrypt.compare(password, usuario.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = generateToken({ id: usuario.id, email: usuario.email });

    //res.json({ token, usuario: { id: usuario.id, email: usuario.email } });
    res.json({ message: "login exitoso",token });
    
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email y contraseña son obligatorios" });
        }

        const existingUser = await model.getUsersEmail(email);

        if (existingUser) {
            return res.status(409).json({ error: "El usuario ya existe" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = await model.saveUser({
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: "Usuario registrado exitosamente", id: userId });

    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ error: "Error al registrar el usuario" });
    }
};

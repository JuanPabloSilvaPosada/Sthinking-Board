// middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtiene el token del encabezado

    if (!token) {
        return res.sendStatus(401); // No se proporciona el token
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Token no válido
        }
        req.user = user; // Agrega la información del usuario al objeto req
        next(); // Llama al siguiente middleware o controlador
    });
};
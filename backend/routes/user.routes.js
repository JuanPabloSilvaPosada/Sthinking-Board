import express from "express";
import {
  loginUser,
  registerUser,
  updatePassword,
  removeUser,
} from "../controllers/user.controller.js"; // Asegúrate de que todas estas funciones estén definidas en tu controlador
import { authenticateToken } from "../middlewares/auth.middleware.js"; // Importa el middleware de autenticación

const router = express.Router();

// Ruta para el inicio de sesión
router.post("/login", loginUser);

// Ruta para registrar un nuevo usuario
router.post("/register", registerUser);

// Ruta para cambiar la contraseña de un usuario (requiere autenticación)
router.put("/changePassword", updatePassword);

// Ruta para eliminar un usuario (requiere autenticación)
router.delete("/delete", authenticateToken, removeUser);

export default router;

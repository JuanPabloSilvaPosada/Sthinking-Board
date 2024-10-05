// routes/board.routes.js
import express from 'express';
import { addBoard, fetchBoards, editBoard, removeBoard } from '../controllers/board.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js'; // Asegúrate de que este middleware esté importado

const router = express.Router();

// Ruta para crear un tablero (requiere autenticación)
router.post('/boards', authenticateToken, addBoard);

// Ruta para obtener todos los tableros de un usuario (requiere autenticación)
router.get('/boards', authenticateToken, fetchBoards);

// Ruta para actualizar un tablero
router.put('/boards/:boardId', authenticateToken, editBoard);

// Ruta para eliminar un tablero
router.delete('/boards/:boardId', authenticateToken, removeBoard);

export default router;

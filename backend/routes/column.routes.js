// routes/column.routes.js
import express from 'express';
import { addColumn, fetchColumns, editColumn, removeColumn } from '../controllers/column.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Ruta para crear una columna
router.post('/boards/:boardId/columns', authenticateToken, addColumn);

// Ruta para obtener todas las columnas de un tablero
router.get('/boards/:boardId/columns', authenticateToken, fetchColumns);

// Ruta para actualizar una columna
router.put('/columns/:columnId', authenticateToken, editColumn);

// Ruta para eliminar una columna
router.delete('/columns/:columnId', authenticateToken, removeColumn);

export default router;
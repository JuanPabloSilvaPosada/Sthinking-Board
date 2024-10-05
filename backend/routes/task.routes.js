import express from 'express';
import { addTask, fetchTasks, modifyTask, removeTask } from '../controllers/task.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Ruta para crear una nueva tarea
router.post('/tasks', authenticateToken, addTask);

// Ruta para obtener todas las tareas de una columna
router.get('/tasks/:columnId', authenticateToken, fetchTasks);

// Ruta para actualizar una tarea específica
router.put('/tasks/:taskId', authenticateToken, modifyTask);

// Ruta para eliminar una tarea específica
router.delete('/tasks/:taskId', authenticateToken, removeTask);

export default router;

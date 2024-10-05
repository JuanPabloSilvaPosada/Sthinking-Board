import { createTask, getTasksByColumn, updateTask, deleteTask } from '../models/task.model.js';

// Controlador para crear una tarea
export const addTask = async (req, res) => {
  try {
    const { title, description, status, columnId } = req.body;
    const userId = req.user.id; // Obtiene el ID del usuario autenticado

    const newTask = await createTask(title, description, status, columnId, userId);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Error creating task' });
  }
};

// Controlador para obtener todas las tareas de una columna
export const fetchTasks = async (req, res) => {
  try {
    const { columnId } = req.params;

    const tasks = await getTasksByColumn(columnId);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
};

// Controlador para actualizar una tarea
export const modifyTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status } = req.body;

    const updatedTask = await updateTask(taskId, title, description, status);
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
};

// Controlador para eliminar una tarea
export const removeTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    await deleteTask(taskId);
    res.status(204).send(); // 204 No Content para indicar eliminación exitosa
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
};
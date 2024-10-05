import pool from '../config/db.js';

// Crear una nueva tarea
export const createTask = async (title, description, status, columnId, userId) => {
  const result = await pool.query(
    'INSERT INTO tasks (title, description, status, column_id, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, description, status, columnId, userId]
  );
  return result.rows[0];
};

// Obtener todas las tareas de una columna
export const getTasksByColumn = async (columnId) => {
  const result = await pool.query('SELECT * FROM tasks WHERE column_id = $1', [columnId]);
  return result.rows;
};

// Actualizar una tarea
export const updateTask = async (taskId, title, description, status) => {
  const result = await pool.query(
    'UPDATE tasks SET title = $1, description = $2, status = $3 WHERE task_id = $4 RETURNING *',
    [title, description, status, taskId]
  );
  return result.rows[0];
};

// Eliminar una tarea
export const deleteTask = async (taskId) => {
  await pool.query('DELETE FROM tasks WHERE task_id = $1', [taskId]);
};
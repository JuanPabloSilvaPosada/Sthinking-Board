import pool from '../config/db.js';

// Función para crear un nuevo tablero
export const createBoard = async (title, userId) => {
  const result = await pool.query(
    'INSERT INTO boards (title, user_id) VALUES ($1, $2) RETURNING *',
    [title, userId]
  );
  return result.rows[0]; // Retorna el tablero creado
};

// Función para obtener todos los tableros de un usuario
export const getAllBoards = async (userId) => {
  const result = await pool.query('SELECT * FROM boards WHERE user_id = $1', [userId]);
  return result.rows; // Retorna todos los tableros del usuario
};

// Función para obtener un tablero específico por ID y el usuario asociado
export const getBoardById = async (boardId, userId) => {
  const result = await pool.query(
    'SELECT * FROM boards WHERE board_id = $1 AND user_id = $2',
    [boardId, userId]
  );
  return result.rows[0]; // Retorna el tablero específico
};

// Función para actualizar un tablero
export const updateBoard = async (boardId, title) => {
  const result = await pool.query(
    'UPDATE boards SET title = $1 WHERE board_id = $2 RETURNING *',
    [title, boardId]
  );
  return result.rows[0]; // Retorna el tablero actualizado
};

// Función para eliminar un tablero
export const deleteBoard = async (boardId) => {
  // Primero elimina las columnas asociadas
  await pool.query('DELETE FROM columns WHERE board_id = $1', [boardId]);
  // Luego elimina el tablero
  await pool.query('DELETE FROM boards WHERE board_id = $1', [boardId]);
};
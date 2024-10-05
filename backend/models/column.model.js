import pool from '../config/db.js';

// Crear una columna
export const createColumn = async (title, boardId) => {
  const result = await pool.query(
    'INSERT INTO columns (title, board_id) VALUES ($1, $2) RETURNING *',
    [title, boardId]
  );
  return result.rows[0];
};

// Obtener todas las columnas de un tablero
export const getColumnsByBoardId = async (boardId) => {
  const result = await pool.query('SELECT * FROM columns WHERE board_id = $1', [boardId]);
  return result.rows;
};

// Actualizar una columna
export const updateColumn = async (columnId, title) => {
  const result = await pool.query(
    'UPDATE columns SET title = $1 WHERE column_id = $2 RETURNING *',
    [title, columnId]
  );
  return result.rows[0];
};

// Eliminar una columna
export const deleteColumn = async (columnId) => {
  await pool.query('DELETE FROM columns WHERE column_id = $1', [columnId]);
};
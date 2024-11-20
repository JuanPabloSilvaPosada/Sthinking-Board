import pool from '../config/db.js';

// Crear una columna con position
export const createColumn = async (title, boardId, position) => {
  const result = await pool.query(
    'INSERT INTO columns (title, board_id, position) VALUES ($1, $2, $3) RETURNING *',
    [title, boardId, position]
  );
  return result.rows[0];
};

// Obtener todas las columnas de un tablero, ordenadas por position
export const getColumnsByBoardId = async (boardId) => {
  const result = await pool.query('SELECT * FROM columns WHERE board_id = $1 ORDER BY position', [boardId]);
  return result.rows;
};

// Actualizar una columna (título y posición)
export const updateColumn = async (columnId, title, position) => {
  const result = await pool.query(
    'UPDATE columns SET title = $1, position = $2 WHERE column_id = $3 RETURNING *',
    [title, position, columnId]
  );
  return result.rows[0];
};

// Eliminar una columna
export const deleteColumn = async (columnId) => {
  await pool.query('DELETE FROM columns WHERE column_id = $1', [columnId]);
};